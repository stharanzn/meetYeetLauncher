
const {initializeApp} = require(firebaseApp) //"https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
const {getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signInWithEmailAndPassword } = require('firebase/auth')// 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
const {getDatabase, ref, set, child, get, onValue} = require=('firebase/database')// "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
// const { popupToast } = require("./common.js");
const dotenv = require('dotenv');

dotenv.config();

const gProvider = new GoogleAuthProvider();

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
  };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp)


export function loginExistingUser(email = null, password = null){
    console.log(email, password)
    var _password = getHashedPass(password)
    signInWithEmailAndPassword(auth, email, _password).then((userCred)=>{
        const user = userCred.user;
        console.log(user)
        popupToast(`User logged in sucessfully...`)
    }).catch((err)=>{
        popupToast("❌ Invalid credentials ❌ " + err.message)
    })
}
    
export function createNewUser(method = 0, email=null, password=null){

    if(method== 0){
        var hashedPass = getHashedPass(password)

        createUserWithEmailAndPassword(auth, email, hashedPass).then((userCred)=>{
            const user = userCred.user;
            console.log(user)
            addUserToDatabase(0, user, email)
            //TODO: add username to the below field
            popupToast(`Account created successfully...`)
            console.log("Logged in using Google successfully...");
        }).catch((err)=>{
            console.log('here error')
            popupToast("Some error occured, please try again later.", "alert")
        })
    }
    else if(method ==1){
        loginUserUsingGoogle()
    }

    
    
}

function loginUserUsingGoogle(){
    signInWithPopup(auth, gProvider).then((result)=>{
        const cred = GoogleAuthProvider.credentialFromResult(result);
        const token = cred.accessToken;
        const user = result.user;            
        addUserToDatabase(1, user);
        //TODO: add username to the below field
        popupToast(`Account created successfully...`)
        console.log("ok")
    }).catch((error)=>{
        popupToast("Authentication terminated by the user. ", "alert")
    })
}

export function signoutUser(){
    auth.signOut().then(function(){
        
    }, function(error){
        console.log('signout error ', error)
    })
}


function addUserToDatabase(method=0, _user = null, _email=null){
    
    // const user = auth.currentUser;
    const db = getDatabase();
    const userName = "user"+ Math.floor(Math.random()* 1001)
    if(method == 0){
        // const _user = auth.currentUser;
        if(_user!= null){
                                    
            set(ref(db, 'users/' + _user.uid + "/accData"), {
                username: userName,
                email: _user.email,
                profile_picture : "urlToProfilePic",
                auth_type : "authenticated",
                auth_method : "emailPass",                
            });
            
        }else{
            popupToast("Cannot add user to the database", "alert")
        }
    }else if(method == 1){
        if(_user!= null){
            console.log
            set(ref(db, 'users/' + _user.uid + "/accData"),{
                username: userName,
                email: _user.email,
                profile_picture: "urlToProfile",
                auth_type: "authenticated",
                auth_method: "google"
            })
            
        }else{
            popupToast("Cannot add user to the database", "alert")
        }
    }else{
        popupToast("Please contact the developers if you see this.", "warnign")
    }
    
    
}

export function getUserData(){
    
    onAuthStateChanged(auth, (user)=>{
        if(user){
            const db = getDatabase();
            const dbref = ref(db);
            get(child(dbref, 'users/' + user.uid + "/accData")).then((snapshot)=>{
                if(snapshot.exists()){
                    console.log(snapshot.val().username);                    
                    return snapshot.val().username;
                }else{
                    console.log("no data available")                    
                }
            }).catch((error)=>{
                console.log(error)
            })
        }
    })
}



function getHashedPass(_pass){

    return `${_pass}123"`;
}


function login(user) {
    console.log("loggin in")
    sessionStorage.setItem("user", user);

}


