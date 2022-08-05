var fs = require('fs');
var path = require('path');

function getFiles(root, files) {
    fs.readdirSync(root).forEach(function (file) {
        var subpath = path.join(root, file);
        if (fs.lstatSync(subpath).isDirectory()) {
            files.push(subpath);
            getFiles(subpath, files);
        }
    });
}

function createFile(filePath, content) {
    fs.writeFileSync(filePath, content);
}

exports.getFiles = getFiles;
exports.createFile = createFile;
