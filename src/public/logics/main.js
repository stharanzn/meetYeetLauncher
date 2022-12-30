const uaup = require('uaup-js');
const { ipcRenderer, shell, remote} = require('electron')

ipcRenderer.on('launchApp', (event, arg)=>{
    console.log(arg);
    // defaultOptions._userUid = arg;
    startApp(arg);
})

var browser;

//#region firebase Functions

const {firebase, initializeApp} = require('firebase/app') //"https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
const {getAuth, onAuthStateChanged, signInWithEmailAndPassword } = require('firebase/auth')// 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
const {getDatabase, ref, set, child, get, onValue} = require=('firebase/database')// "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


const firebaseConfig = {
    apiKey: "AIzaSyDlnTTuJhrZZgNO2Kf59lIXwMIb8z0lNgk",
    authDomain: "meetyeet-c82aa.firebaseapp.com",
    databaseURL: "https://meetyeet-c82aa-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "meetyeet-c82aa",
    storageBucket: "meetyeet-c82aa.appspot.com",
    messagingSenderId: "850717122836",
    appId: "1:850717122836:web:cd44e207b95dec9595e201",
    measurementId: "G-0MCKNXRMXC"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp)


function loginExistingUser(email = null, password = null){
    console.log(email, password)
    var _password = getHashedPass(password)
    signInWithEmailAndPassword(auth, email, _password).then((userCred)=>{
        const user = userCred.user;
        console.log(user.uid)
        popupToast(`User logged in sucessfully...`)
        startApp(user.uid)
    }).catch((err)=>{
        popupToast("❌ Invalid credentials ❌ " + err.message)
    })
}

function loginUserUsingGoogle(){
    console.log('ok')
    const _browser = shell.openExternal("https://virtualmeetapp.azurewebsites.net/googleSignin")

}

function signoutUser(){
    auth.signOut().then(function(){
        
    }, function(error){
        console.log('signout error ', error)
    })
}

function getUserData(){
    
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


function popupToast(_message, _status = "info"){
    let popup = `
        <div class="toast ${_status}">${_message}.</div>
        `
        let toasterDiv = document.getElementById('toaster')
        toasterDiv.style.transition = "1s all ease !important"
        toasterDiv.innerHTML = popup;
    setTimeout(() => {
        const elem = document.getElementById('toaster');
        elem.innerHTML = "";
    }, 4000);
    
}


//#endregion



// document.getElementById('createUser').addEventListener('click', callCreateUserUsingEmailPass);

document.getElementById('loginUser').addEventListener('click', callLoginUser);

function callLoginUser(){
    console.log("intiated login procecss.")
    loginExistingUser(document.getElementById('loginUserEmail').value, document.getElementById('loginUserPass').value)
}

document.getElementById('loginUserGoogle').addEventListener('click', callLoginUsingGoogle);

function callLoginUsingGoogle(){
    loginUserUsingGoogle()
}



//#endregion

// #region upadte, run etc
var app_library = (process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")) + "\\";

console.log(process.env.APPDATA, process.env.HOME)

//set default stages of the process.
const defaultStages = {
    Checking: "Checking For Updates...",
    Found: "Update Found!",
    NotFound: "Build Upto Date",
    Downloading: "Downloading...",
    Unzipping: "Installing...",
    Cleaning: "Finalizing...",
    Launch: "Let's roll..."    
};


const defaultOptions = {
    useGithub: true,
    gitRepo: "MeetYeetBuild",
    gitUsername: "stharanzn",
    isGitRepoPrivate: false,

    _userUid: process.env.userUid,
    _authState: false,

    appName: "VirtualWorld",
    appExecutableName: "VirtualWorld.exe",

    appDirectory: app_library + "VirtualWorld",
    versionFile: app_library + "/meetyeetlauncher/settings/version.json",
    tempDirectory: app_library + "/meetyeetlauncher/tmp",

    progressBar: document.getElementById('download'),
    launchBtn: document.getElementById('launchApp'),
    label: document.getElementById('statusLabel'),
    forceUpdate: false,
    stageTitles: defaultStages
};

uaup.Update(defaultOptions);

document.getElementById('launchApp').addEventListener('click', function(event){

    uaup.LaunchApplication(defaultOptions)
})

//#endregion



function startApp(uid){
    console.log("start app")
    defaultOptions._userUid = uid;
    defaultOptions._authState = true;
    uaup.LaunchApplication(defaultOptions);
    
}

window.onload = ()=>{
    document.getElementById("appArea").style.opacity = 1;
    showLoginFrag()
    
}

function showLoginFrag(){        
    document.getElementById('loginFragment').style.display = "flex"
    document.getElementById('loginFragment').style.opacity = 1
}

function resetInputs(){
    document.getElementById('loginUserEmail').innerHTML = ""
    document.getElementById('loginUserPass').innerHTML = ""
}

document.getElementById("close").addEventListener("click", ()=>{
    console.log("here though")
    window.close();
    process.close();
    
})


const _user = auth.currentUser;
if(_user!== null){
    console.log("already logged in")
    resetInputs();
}else{
    showLoginFrag();
    console.log('nope')
}

onAuthStateChanged(auth, (user)=>{
    if(user){
        const uid = user.uid;
        startApp(uid);
    }else{
        showLoginFrag();
        console.log("nope again")
    }
})




