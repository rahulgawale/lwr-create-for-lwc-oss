const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

// internal imports
const layoutHtml = require('./templates/layout-html.js');
const layoutNunjucks = require('./templates/layout-nunjucks.js');
const commonUtils = require('./utils/commonUtility.js');
const fsUtility = require('./utils/fsUtility.js');

const layoutNameOptions = (vscode.InputBoxOptions = {
    prompt: `Enter layout file name in camelCase, e.g. myLayout`,
    placeHolder: 'Enter file Name',
    validateInput: commonUtils.validateFileName,
    ignoreFocusOut: true
});

const customFolderOptions = (vscode.QuickPickOptions = {
    title: `Select the destination folder the layout`
});

const layoutsFolder = '/src/layouts';
const srcFolder = '/src';

async function getFolder() {
    let selectedFolder = await vscode.window.showQuickPick(
        [layoutsFolder, 'Custom'],
        {
            placeHolder: 'Select the destination folder for layout'
        }
    );

    if (selectedFolder === 'Custom') {
        let files = [];
        fsUtility.getFiles(
            path.join(vscode.workspace.rootPath, srcFolder),
            files
        );
        return await vscode.window.showQuickPick(files, customFolderOptions);
    }
    if (selectedFolder) {
        return vscode.workspace.rootPath + selectedFolder;
    }

    return selectedFolder;
}

async function createLayout(content, extension) {
    try {
        let layoutFolderPath = await getFolder();
        if (!layoutFolderPath) {
            return;
        }
        if (fs.existsSync(layoutFolderPath)) {
            let fileName = await vscode.window.showInputBox(layoutNameOptions);
            if (fileName) {
                let filePath = path.join(
                    layoutFolderPath,
                    fileName + extension
                );

                if (fs.existsSync(filePath)) {
                    vscode.window.showErrorMessage(
                        `Layout "${fileName}${extension}" already exists`
                    );
                    return;
                }
                let fileNameCap = commonUtils.capitalizeFirstLetter(fileName);
                fsUtility.createFile(
                    filePath,
                    mustache.render(content, {
                        pageTitle: commonUtils.capitalizeFirstLetter(fileName)
                    })
                );
                commonUtils.openFileVSC(vscode, filePath, 1);
                vscode.window.showInformationMessage(
                    `LWR: Component "${fileNameCap}" created successfully!`
                );
            }
        } else {
            vscode.window.showErrorMessage(
                `Folder "${layoutsFolder}" is not found. Please create the folder and try again.`
            );
        }
    } catch (error) {
        console.log('Error in Layout ', error);
        vscode.window.showErrorMessage(
            `LWR: Could not create the layout. ${error}`
        );
    }
}

async function createNunjucksLayout() {
    return await createLayout(layoutNunjucks.template, '.njk');
}

async function createHtmlLayout() {
    return await createLayout(layoutHtml.template, '.html');
}

exports.createHtmlLayout = createHtmlLayout;
exports.createNunjucksLayout = createNunjucksLayout;
