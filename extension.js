const vscode = require('vscode');
const lwcService = require('./src/lwcService');
const layoutService = require('./src/layoutService');
const contentService = require('./src/contentService');

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
            'lwr-create-for-lwc-oss.createHtmlLayout',
            layoutService.createHtmlLayout
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'lwr-create-for-lwc-oss.createNunjucksLayout',
            layoutService.createNunjucksLayout
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'lwr-create-for-lwc-oss.createMarkdownContent',
            contentService.createMarkdownContent
        )
    );
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
