const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

// internal imports
const layoutMarkdown = require('./templates/content-md.js');
const commonUtils = require('./utils/commonUtility.js');
const fsUtility = require('./utils/fsUtility.js');

const customFolderOptions = (vscode.QuickPickOptions = {
    title: `Select the destination folder content`,
    placeHolder: 'Select the destination folder'
});

const contentNameOptions = (vscode.InputBoxOptions = {
    prompt: `Enter layout file name in camelCase, e.g. aboutUs`,
    placeHolder: 'Enter file Name',
    validateInput: commonUtils.validateFileName,
    ignoreFocusOut: true
});

const contentFolder = '/src/content';
const srcFolder = '/src';

async function getFolder() {
    let selectedFolder = await vscode.window.showQuickPick(
        [contentFolder, 'Custom'],
        {
            placeHolder: 'Select the destination folder for content'
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

async function createContent(content, extension) {
    try {
        let contentFolderPath = await getFolder();
        if (!contentFolderPath) {
            return;
        }

        if (fs.existsSync(contentFolderPath)) {
            let fileName = await vscode.window.showInputBox(contentNameOptions);
            if (fileName) {
                let filePath = path.join(
                    contentFolderPath,
                    fileName + extension
                );

                if (fs.existsSync(filePath)) {
                    vscode.window.showErrorMessage(
                        `File "${fileName}${extension}" already exists`
                    );
                    return;
                }

                let fileNameCap = commonUtils.capitalizeFirstLetter(fileName);
                fsUtility.createFile(filePath, content);
                commonUtils.openFileVSC(vscode, filePath, 1);
                vscode.window.showInformationMessage(
                    `LWR: Content "${fileNameCap}${extension}" created successfully!`
                );
            }
        } else {
            vscode.window.showErrorMessage(
                `Folder "${contentFolder}" is not found. Please create the folder and try again.`
            );
        }
    } catch (error) {
        console.log('Error in Content ', error);
        vscode.window.showErrorMessage(
            `LWR: Could not create the content: ${error}`
        );
    }
}

async function createMarkdownContent() {
    return await createContent(layoutMarkdown.template, '.md');
}

exports.createMarkdownContent = createMarkdownContent;
