(function () {'use strict';

exports.__esModule = true;
var ipcRenderer = require('electron').ipcRenderer;
init();
function init() {
    window.bridge = {
        exec: exec
    };
}
exports.init = init;
function exec(data) {
    ipcRenderer.send('from-web', data);
}
exports.exec = exec;

}());
//# sourceMappingURL=preload.js.map