'use strict';

const ipcRenderer = require('electron').ipcRenderer;

init();

export function init() {

    (<any>window).bridge = {
        exec
    }

}

export function exec(data) {
    ipcRenderer.send('from-web', data)
}