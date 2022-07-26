const vscode = require('vscode');
const lwcService = require('./src/lwcService');
const layoutService = require('./src/layoutService');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'lwr-create-for-lwc-oss.createLwc',
            lwcService.createLwc
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'lwr-create-for-lwc-oss.createJsOnlyLwc',
            lwcService.createJsOnlyLwc
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'lwr-create-for-lwc-oss.createCssOnlyLwc',
            lwcService.createCssOnlyLwc
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'lwr-create-for-lwc-oss.createLayout',
            layoutService.createLayout
        )
    );
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
