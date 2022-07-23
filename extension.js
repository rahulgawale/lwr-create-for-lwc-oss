const vscode = require('vscode');
const lwcService = require('./src/lwcService');
const layoutService = require('./src/layoutService');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand(
        'lwr-snippets.createLwc',
        function () {
            lwcService.createLwc();
        }
    );

    context.subscriptions.push(disposable);

    let disposableLayout = vscode.commands.registerCommand(
        'lwr-snippets.createLayout',
        function () {
            layoutService.createLayout();
        }
    );

    context.subscriptions.push(disposableLayout);

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'lwr-snippets.createJsOnlyLwc',
            function () {
                lwcService.createJsOnlyLwc();
            }
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'lwr-snippets.createCssOnlyLwc',
            function () {
                lwcService.createCssOnlyLwc();
            }
        )
    );
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
