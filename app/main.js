(function () {'use strict';

exports.__esModule = true;
var electron = require('electron');
var electron_1 = require("electron");
var menubar = require('menubar');
var path = require('path');
var url = require('url');
var _ = require("underscore");
var popupUrl = url.format({
    pathname: path.join(__dirname, 'popup.html'),
    protocol: 'file:',
    slashes: true
});
var mb = menubar({
    index: popupUrl,
    tooltip: "Brain Trainer",
    icon: __dirname + "/icon.png",
    width: 400,
    height: 500,
    transparent: true,
    alwaysOnTop: false,
    showOnRightClick: true,
    blurDelay: 100
});
var isShown = false;
var contextMenu = electron.Menu.buildFromTemplate([
    {
        label: 'Open',
        click: function () {
            Main.mainWindow.show();
        }
    },
    {
        label: 'About',
        click: function () {
            electron.dialog.showMessageBox({
                title: "Brain Trainer",
                type: "info",
                message: "Train your brain with Brain Trainer today\nCreated as a semester project at Fh-Bielefeld Campus Minden, 2017",
                buttons: ["Close"]
            });
        }
    },
    {
        label: 'Website',
        click: function () {
            electron.shell.openExternal("https://braintrainer.herokuapp.com/layout.html");
        }
    },
    {
        type: 'separator'
    },
    {
        label: 'Quit',
        click: function () {
            Main.willQuit = true;
            mb.app.quit();
        }
    }
]);
var Main = (function () {
    function Main() {
    }
    Main.onWindowAllClosed = function () {
        if (process.platform !== 'darwin')
            Main.application.quit();
    };
    Main.onClose = function (e) {
        if (!Main.willQuit) {
            e.preventDefault();
            Main.mainWindow.hide();
        }
    };
    Main.onClosed = function () {
        // Dereference the window object.
        Main.mainWindow = null;
    };
    Main.onReady = function () {
        Main.mainWindow =
            new Main.BrowserWindow({ width: 800, height: 600 });
        Main.mainWindow
            .loadURL('https://braintrainer.herokuapp.com/layout.html');
        Main.mainWindow.on('close', Main.onClose);
        Main.mainWindow.on('closed', Main.onClosed);
    };
    Main.main = function (app, browserWindow) {
        // we pass the Electron.App object and the
        // Electron.BrowserWindow into this function
        // so this class has no dependencies.  This
        // makes the code easier to write tests for
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
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
                isShown = false;
            }).on('focus-lost', function () {
                if (isShown) {
                    mb.hideWindow();
                }
                isShown = false;
                console.log("focus lost");
            });
            mb.tray.on('click', function () {
                if (isShown) {
                    isShown = false;
                    mb.hideWindow();
                }
                else {
                    isShown = true;
                    mb.showWindow();
                }
                console.log("Click");
                console.log("=>");
            });
        });
        electron_1.ipcMain.on('from-web', function (event, data) {
            console.log("From Web");
            console.log(data);
            if (data) {
                if (data.type === 'popup') {
                    mb.showWindow();
                }
            }
        });
    };
    Main.willQuit = false;
    return Main;
}());
exports["default"] = Main;
Main.main(electron_1.app, electron_1.BrowserWindow);

}());
//# sourceMappingURL=main.js.map