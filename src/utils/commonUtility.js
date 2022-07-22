function gotoLine(vscode, lineNumber) {
    let editor = vscode.window.activeTextEditor;
    let range = editor.document.lineAt(lineNumber - 1).range;
    console.log('range', range.start, range.end);
    editor.selection = new vscode.Selection(range.start, range.end);
    editor.revealRange(range);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createFile(fs, path, content) {
    fs.writeFileSync(path, content);
}

function validateFileName(componentName) {
    if (!componentName) {
        return 'component name can not be empty';
    }
    if (!componentName.match(/^[0-9a-zA-Z]+$/)) {
        return "component can't have non-alphanumeric character";
    }
    return null;
}

function getDirectories(fs, path) {
    return fs
        .readdirSync(path)
        .filter(function (file) {
            return fs.statSync(path + '/' + file).isDirectory();
        })
        .map(function (file) {
            return path + '/' + file;
        });
}

function openFileVSC(vscode, path, lineAt) {
    vscode.workspace.openTextDocument(path).then((doc) =>
        vscode.window.showTextDocument(doc, { preview: false }).then(() => {
            gotoLine(vscode, lineAt);
            console.log('opened file: ', path);
        })
    );
}

exports.gotoLine = gotoLine;
exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.createFile = createFile;
exports.validateFileName = validateFileName;
exports.openFileVSC = openFileVSC;
exports.getDirectories = getDirectories;
