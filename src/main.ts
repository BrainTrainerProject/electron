const electron = require('electron')
import {app, BrowserWindow, ipcMain} from "electron";
const menubar = require('menubar');
const path = require('path')
const url = require('url')
const _ = require("underscore")

const popupUrl = url.format({
    pathname: path.join(__dirname, 'popup.html'),
    protocol: 'file:',
    slashes: true
});

const mb = menubar({
    index: popupUrl,
    tooltip: "Correo",
    icon: __dirname + "/res/icon.png",
    width: 400,
    height: 500,
    transparent: true,
    alwaysOnTop: false,
    showOnRightClick: true,
    blurDelay: 100
});

let isShown = false;

const contextMenu = electron.Menu.buildFromTemplate([
    {
        label: 'About',
        click() {
            electron.dialog.showMessageBox({
                title: "Correo",
                type: "info",
                message: "A menubar/taskbar Gmail App \nMIT Copyright (c) 2016 Amit Merchant <bullredeyes@gmail.com>",
                buttons: ["Close"]
            });
        }
    },
    {
        label: 'Website',
        click() {
            electron.shell.openExternal("https://github.com/amitmerchant1990/correo");
        }
    },
    {
        type: 'separator'
    },
    {
        label: 'Quit',
        click() {
            mb.app.quit();
        }
    }

]);

export default class Main {

    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow;

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin')
            Main.application.quit();
    }

    private static onClose() {
        // Dereference the window object.
        Main.mainWindow = null;
    }

    private static onReady() {
        Main.mainWindow =
            new Main.BrowserWindow({width: 800, height: 600})
        Main.mainWindow
            .loadURL('file://' + __dirname + '/index.html');
        Main.mainWindow.on('closed', Main.onClose);
    }

    static main(app: Electron.App,
                browserWindow: typeof BrowserWindow) {
        // we pass the Electron.App object and the
        // Electron.BrowserWindow into this function
        // so this class has no dependencies.  This
        // makes the code easier to write tests for

        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed',
            Main.onWindowAllClosed);
        Main.application.on('ready',
            Main.onReady);


        /////////////////////////
        // POPUP

        mb.on('ready', function ready() {

            if (process.platform == 'win32') {
                mb.tray.setContextMenu(contextMenu);
            }

            mb.on('after-show', function () {
                isShown = true;
                console.log("after show");
            }).on('after-hide', function () {
                isShown = false
            }).on('focus-lost', function () {
                if (isShown) {
                    mb.hideWindow();
                }
                isShown = false
                console.log("focus lost")

            });

            mb.tray.on('click', function () {
                if (isShown) {
                    isShown = false;
                    mb.hideWindow()
                } else {
                    isShown = true;
                    mb.showWindow()
                }
                console.log("Click")
                console.log("=>")
            });

        });


        ipcMain.on('from-web', function (event, data) {

            console.log("From Web")
            console.log(data)

            if (data) {
                if (data.type === 'popup') {
                    mb.showWindow()
                }
            }

        })

    }
}

Main.main(app, BrowserWindow);