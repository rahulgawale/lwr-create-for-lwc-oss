// library imports
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

// internal imports
const lwc = require('./templates/lwc.js');
const lwcHtml = require('./templates/lwc-html.js');
const lwcCss = require('./templates/lwc-css.js');
const lwcJsUtility = require('./templates/lwc-js-utility.js');
const fsUtility = require('./utils/fsUtility.js');

const commonUtils = require('./utils/commonUtility.js');

const componentNameOptions = (vscode.InputBoxOptions = {
    prompt: `Enter component name in camelCase, e.g. myComponent`,
    placeHolder: 'Enter Component Name',
    validateInput: commonUtils.validateFileName,
    ignoreFocusOut: true
});

const cssOptions = (vscode.QuickPickOptions = {
    title: `Do you want to include CSS file?`,
    placeHolder: 'Include CSS file in component?'
});

const customFolderOptions = (vscode.QuickPickOptions = {
    title: `Select the destination folder the component`,
    placeHolder: 'Select the destination folder'
});

const modulesFolder = '/src/modules';
const srcFolder = '/src';

async function getFolder() {
    let selectedFolder = await vscode.window.showQuickPick(
        [modulesFolder + '/my', modulesFolder + '/c', 'Custom'],
        {
            placeHolder: 'Select the destination folder for component'
        }
    );

    let finalFolderPath;
    if (selectedFolder) {
        if (selectedFolder === 'Custom') {
            let files = [];
            fsUtility.getFiles(
                path.join(vscode.workspace.rootPath, srcFolder),
                files
            );
            finalFolderPath = await vscode.window.showQuickPick(
                files,
                customFolderOptions
            );
        } else {
            finalFolderPath = vscode.workspace.rootPath + selectedFolder;
        }
    }
    return finalFolderPath;
}

async function createLwc() {
    // show option to enter component name

    let componentName = await vscode.window.showInputBox(componentNameOptions);
    // show option to select directory

    if (componentName) {
        let selectedFolder = await getFolder();

        if (selectedFolder) {
            let includeCss = await vscode.window.showQuickPick(
                ['Yes', 'No'],
                cssOptions
            );
            if (includeCss) {
                includeCss = includeCss === 'Yes';
                createLwcComponent(selectedFolder, componentName, includeCss);
            }
        }
    }
}

function createLwcComponent(componentPath, componentName, includeCss) {
    try {
        const componentFolder = path.join(componentPath, componentName);
        fs.mkdirSync(componentFolder);

        const capName = commonUtils.capitalizeFirstLetter(componentName);

        fs.writeFileSync(
            path.join(componentFolder, componentName + '.js'),
            mustache.render(lwc.template, { componentName: capName })
        );

        fs.writeFileSync(
            path.join(componentFolder, componentName + '.html'),
            lwcHtml.template
        );

        if (includeCss) {
            fs.writeFileSync(
                path.join(componentFolder, componentName + '.css'),
                lwcCss.template
            );
        }

        openFileInEditor(path.join(componentFolder, componentName + '.js'), 3);

        vscode.window.showInformationMessage(
            `LWR: Component ${componentName} created successfully!`
        );
    } catch (error) {
        console.log('Error in createLwcComponent ', error);
        vscode.window.showErrorMessage(
            `LWR: Could not create the component. ${error}`
        );
    }
}

async function createJsOnlyLwc() {
    try {
        let componentName = await vscode.window.showInputBox(
            componentNameOptions
        );
        // show option to select directory

        if (componentName) {
            const selectedFolder = await getFolder();
            if (selectedFolder) {
                const componentFolder = path.join(
                    selectedFolder,
                    componentName
                );
                fs.mkdirSync(componentFolder);

                const capName =
                    commonUtils.capitalizeFirstLetter(componentName);

                fs.writeFileSync(
                    path.join(componentFolder, componentName + '.js'),
                    mustache.render(lwcJsUtility.template, {
                        componentName: capName
                    })
                );

                openFileInEditor(
                    path.join(componentFolder, componentName + '.js'),
                    2
                );

                vscode.window.showInformationMessage(
                    `LWR: Component ${componentName} created successfully!`
                );
            }
        }
    } catch (error) {
        console.log('Error in createJsOnlyLwc ', error);
        vscode.window.showErrorMessage(
            `LWR: Could not create the component. ${error}`
        );
    }
}

async function createCssOnlyLwc() {
    try {
        let componentName = await vscode.window.showInputBox(
            componentNameOptions
        );
        // show option to select directory

        if (componentName) {
            const selectedFolder = await getFolder();
            if (selectedFolder) {
                const componentFolder = path.join(
                    selectedFolder,
                    componentName
                );
                fs.mkdirSync(componentFolder);

                fs.writeFileSync(
                    path.join(componentFolder, componentName + '.css'),
                    lwcCss.template
                );

                openFileInEditor(
                    path.join(componentFolder, componentName + '.css'),
                    2
                );

                vscode.window.showInformationMessage(
                    `LWR: Template "${componentName}" created successfully!`
                );
            }
        }
    } catch (error) {
        console.log('Error in createCssOnlyLWc ', error);
        vscode.window.showErrorMessage(
            `LWR: Could not create the component. ${error}`
        );
    }
}

function openFileInEditor(path, line) {
    vscode.workspace.openTextDocument(path).then((doc) =>
        vscode.window.showTextDocument(doc, { preview: false }).then(() => {
            commonUtils.gotoLine(vscode, line);
        })
    );
}
exports.createLwc = createLwc;
exports.createJsOnlyLwc = createJsOnlyLwc;
exports.createCssOnlyLwc = createCssOnlyLwc;
