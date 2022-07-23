const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

// internal imports
const layoutHtml = require('./templates/layout-html.js');
const commonUtils = require('./utils/commonUtility.js');

const layoutNameOptions = (vscode.InputBoxOptions = {
    prompt: `Enter layout file name in camelCase, e.g. myLayout`,
    placeHolder: 'Enter file Name',
    validateInput: commonUtils.validateFileName,
    ignoreFocusOut: true
});

const customFolderOptions = (vscode.QuickPickOptions = {
    title: `Select the destination folder for your layout`
});

async function getFolder() {
    let selectedFolder = await vscode.window.showQuickPick(
        ['/src/layouts', 'Custom'],
        {
            placeHolder: 'Select the destination folder for your component'
        }
    );

    if (selectedFolder === 'Custom') {
        return await vscode.window.showQuickPick(
            commonUtils.getDirectories(fs, vscode.workspace.rootPath),
            customFolderOptions
        );
    }
    if (selectedFolder) {
        return vscode.workspace.rootPath + selectedFolder;
    }

    return selectedFolder;
}

async function createLayout() {
    try {
        let layoutFolderPath = await getFolder();
        if (fs.existsSync(layoutFolderPath)) {
            let fileName = await vscode.window.showInputBox(layoutNameOptions);
            if (fileName) {
                let filePath = path.join(layoutFolderPath, fileName + '.html');

                if (fs.existsSync(filePath)) {
                    vscode.window.showErrorMessage(
                        `Layout with the name ${fileName}.html already exists`
                    );
                    return;
                }
                let fileNameCap = commonUtils.capitalizeFirstLetter(fileName);
                commonUtils.createFile(
                    fs,
                    filePath,
                    mustache.render(layoutHtml.template, {
                        pageTitle: commonUtils.capitalizeFirstLetter(fileName)
                    })
                );
                commonUtils.openFileVSC(vscode, filePath, 1);
                vscode.window.showInformationMessage(
                    `LWR: Component ${fileNameCap} created successfully!`
                );
            }
        } else {
            vscode.window.showErrorMessage(
                'No layouts folder found. Create one...'
            );
        }
    } catch (error) {
        console.log('Error in createLayout ', error);
        vscode.window.showErrorMessage(
            `LWR: Could not create the layout. ${error}`
        );
    }
}

exports.createLayout = createLayout;
