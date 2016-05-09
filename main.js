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
    title: "PipelineDog",
    icon: __dirname + "/img/icon_256x256.png"
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  //mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    if(runWindow) runWindow.close();
    mainWindow = null;
  });

}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('createRun', function(event, workDir, command) {
  runWindow = new BrowserWindow({ width: 600, height: 300, autoHideMenuBar: true });
  runWindow.loadURL('file://' + __dirname + '/run.html');

  runWindow.on('close', function() {
    runWindow.webContents.send('runclosing');
  });
  
  ipcMain.on('confirmClose', function() {
    runWindow = null;
  })

  runWindow.webContents.on('did-finish-load', function() {
    runWindow.webContents.send('winloaded', workDir, command);
  }.bind(this));
});