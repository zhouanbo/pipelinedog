'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = require('electron').ipcMain;

let mainWindow;
let runWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 600,
    title: "PipelineDog"
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  //mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
  
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('createRun', createRunWindow);

function createRunWindow () {
  runWindow = new BrowserWindow({ width: 600, height: 300, alwaysOnTop: true });  
  runWindow.loadURL('file://' + __dirname + '/run.html');
  
  runWindow.on('closed', function() {
    if(mainWindow) mainWindow.webContents.send('runclosed');
    runWindow = null;
  });
      
  runWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.send('winloaded');
  });
  
  ipcMain.on('ondata', function(event, msg) {
    if(runWindow) runWindow.webContents.send('senddata', msg);
  });
  
}
