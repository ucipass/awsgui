const electron = require('electron')
const url = require('url')
const path = require('path')
const cons = require('console');
const {app, BrowserWindow, Menu, ipcMain, session} = electron
app.console = new cons.Console(process.stdout, process.stderr);
let mainWindow;

// set ENV
process.env.NODE_ENV = 'production'

// Listen for app to be ready
app.on('ready', ()=>{
    //create new window
    let iconPath
    if (process.platform == 'darwin'){ iconPath = 'assets/icons/mac/icon.icns'}
    if (process.platform == 'linux'){ iconPath = 'assets/icons/png/icon.png'}
    if (process.platform == 'win32'){ iconPath = 'assets/icons/win/icon.ico'}
    
    getCookie("awsform")

    mainWindow = new BrowserWindow({
        //width,
        //height,
        //fullscreenable: true,
        //fullscreen: true,
        icon: path.resolve(__dirname, iconPath)     ,
        webPreferences: {
            nodeIntegration: true
          }   
    });
    // load HTML into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    //Quit app whyen closed
    mainWindow.on('closed', ()=>{
        app.quit()
    })

    ipcMain.on('form-data', (event, arg) => {
        console.log( arg );
        setCookie("awsform",arg)

    })
    countDown()
})

function countDown(){
    setInterval(() => {
        // console.log(Date())
        mainWindow.webContents.send('item:add', Date())
    }, 5000);
}

function setCookie(name,value){
    let jsonvalue = JSON.stringify(value)
    let cookie = { 
        url: 'http://myapp.com',
        name: name, 
        value: jsonvalue,
        domain: 'myapp.com', 
        expirationDate: 921557691934,
    }
    session.defaultSession.cookies.set(cookie)
    .then(() => { console.log("SUCCESSs COOKIE")}, (error) => {
        console.error("ERROR COOKIE",error)
    })
}

function getCookie(name){
    // Query all cookies.
    session.defaultSession.cookies.get({name: name})
    .then((cookies) => { 
        let json = cookies.length ? JSON.parse(cookies[0].value) : null
        console.log("Cookies", json)
        return json
    })
    .catch((error) => { 
        console.log("Cookies ERROR",error)
        return null
    })   

}