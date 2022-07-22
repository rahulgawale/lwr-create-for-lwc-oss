// library imports
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

// internal imports
const lwc = require('./templates/lwc.js');
const lwcHtml = require('./templates/lwc-html.js');
const lwcCss = require('./templates/lwc-css.js');

const commonUtils = require('./utils/commonUtility.js');

const componentNameOptions = (vscode.InputBoxOptions = {
    prompt: `Enter component name in camelCase, e.g. myComponent`,
    placeHolder: 'Enter Component Name',
    validateInput: commonUtils.validateFileName,
    ignoreFocusOut: true
});

const componentFolderOptions = (vscode.InputBoxOptions = {
    prompt: `Component will be created at ${vscode.workspace.rootPath}\<your-custom-path>`,
    placeHolder: 'Enter Path for Destination Folder to Create Component',
    validateInput: validateFolderPath,
    ignoreFocusOut: true
});

function createLwc() {
    // show option to enter component name

    vscode.window.showInputBox(componentNameOptions).then((componentName) => {
        // show option to select directory

        if (componentName) {
            vscode.window
                .showQuickPick(['/src/modules', '/src/components', 'Custom'], {
                    placeHolder:
                        'Select the destination folder for your component'
                })
                .then((selection) => {
                    if (selection === 'Custom') {
                        vscode.window
                            .showInputBox(componentFolderOptions)
                            .then((customFolder) => {
                                if (customFolder) {
                                    const componentPath = path.join(
                                        vscode.workspace.rootPath,
                                        customFolder
                                    );
                                    createComponent(
                                        componentPath,
                                        componentName
                                    );
                                }
                            });
                    } else if (selection) {
                        const componentPath =
                            vscode.workspace.rootPath + selection;
                        createComponent(componentPath, componentName);
                    }
                });
        }
    });
}

function validateFolderPath(folder) {
    if (!folder) {
        return 'folder name can not be empty';
    }
    return null;
}

function createComponent(componentPath, componentName) {
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
        fs.writeFileSync(
            path.join(componentFolder, componentName + '.css'),
            lwcCss.template
        );

        vscode.workspace
            .openTextDocument(path.join(componentFolder, componentName + '.js'))
            .then((doc) =>
                vscode.window
                    .showTextDocument(doc, { preview: false })
                    .then(() => {
                        commonUtils.gotoLine(vscode, 3);
                        console.log(
                            'opened file: ',
                            componentFolder + '/' + componentName + '.js'
                        );
                    })
            );

        vscode.window.showInformationMessage(
            `LWR: Component ${componentName} created successfully!`
        );
    } catch (error) {
        console.log('Error in createLwc ', error);
        vscode.window.showErrorMessage(
            `LWR: Could not create the component. ${error}`
        );
    }
}

exports.createLwc = createLwc;
