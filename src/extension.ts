import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Poetry Syntax Highlight extension is being activated...');

	const helloWorldCommand = vscode.commands.registerCommand('poetry-syntax-highlight.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Poetry Syntax Highlight!');
	});

	context.subscriptions.push(helloWorldCommand);

	vscode.window.showInformationMessage('Poetry Syntax Highlight extension is now active!');

	console.log('Poetry Syntax Highlight extension activated successfully');
}

export function deactivate() {
	console.log('Poetry Syntax Highlight extension is being deactivated...');
	vscode.window.showInformationMessage('Poetry Syntax Highlight extension is now deactivated!');
}
