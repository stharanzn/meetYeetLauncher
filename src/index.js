const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const _firebase = require('firebase/app')
const {getAuth, GoogleAuthProvider, signInWithCredential} = require('firebase/auth')
const dotenv = require('dotenv')

dotenv.config();

// console.log(__dirname)

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

//#region config firebase

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

_firebase.initializeApp(firebaseConfig);
// const auth = getAuth(_firebase)

ipcMain.on('launchApp', (event, arg)=>{
  console.log(arg)
})

function loginUserUsingGoogle(token){
  const auth = getAuth()
  console.log(token)
  const _credentials = GoogleAuthProvider.credential(token)
  signInWithCredential(auth, _credentials).then((result)=>{

      const user = result.user;                
      process.env.userUid = result.user.uid; 
      mainWindow.webContents.send('launchApp', result.user.uid)
  }).catch((error)=>{
    console.log("noooo " + error)

  })
}
//#endregion

//#region main process

let mainWindow;

if(process.defaultApp){
  if(process.argv.length >=2){
    app.setAsDefaultProtocolClient('meet-yeet', process.execPath, [path.resolve(process.argv[1])])
  }else{
    app.setAsDefaultProtocolClient('meet-yeet')
  }
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1600,
    height: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // preload: path.join(__dirname, 'preload.js'),
    },
  });

  // mainWindow.openDevTools();
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // mainWindow.setMenu(null)  
  
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  app.quit(); 
  
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('send-token', (message)=>{
  console.log('ok send token')
})
//#endregion


//#region check for protocol call
const gotTheLock = app.requestSingleInstanceLock()
console.log(gotTheLock)

if(!gotTheLock){
  app.quit();
}else{
  
  app.on('second-instance', (event, argv, workingDirectory)=>{
    
    if(mainWindow){
      
      console.log(argv)
      
      const argToken = argv[3]
      const token = argToken?.substring(12).slice(0, -1);
      loginUserUsingGoogle(token)
      if(mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus();
      
      
    }
  })
}

//#endregion






