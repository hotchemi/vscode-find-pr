import * as vscode from "vscode";
import { open } from "fs";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("extension.sayHello", () => {
    // The code you place here will be executed every time your command is executed
    openUrl("https://www.google.com");
  });

  context.subscriptions.push(disposable);
}

function openUrl(url: string) {
  vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(url));
}

// this method is called when your extension is deactivated
export function deactivate() {}
