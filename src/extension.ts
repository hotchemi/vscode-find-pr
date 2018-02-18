import * as vscode from "vscode";
import { open } from "fs";
import { spawn } from "child_process";
import child_process = require("child_process");
import { GIT_COMMAND_IN_PATH } from "./constants";
const readline = require("readline");
import Path = require("path");

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("extension.sayHello", () => {
    const filename = vscode.window.activeTextEditor.document.fileName;
    const lineNumber = vscode.window.activeTextEditor.selection.active.line;



    const currentDirectory = Path.dirname(filename);
    const gitConfig = vscode.workspace.getConfiguration("git");
    const command = <string>gitConfig.get("path", "git");
    const gitExecOptions = {
      cwd: currentDirectory
    };

    const blame = spawn("git", ["blame", "--first-parent", "-L", `${lineNumber},${lineNumber}`, filename], gitExecOptions);
    const lines = readline.createInterface({ input: blame.stdout });
    lines.on("line", input => {
      const [hash, content] = input.split(/ .*?\) /);
      console.log(hash);
      console.log("********");
      console.log(content);
    });
  });

  context.subscriptions.push(disposable);
}

function openUrl(url: string) {
  vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(url));
}

// this method is called when your extension is deactivated
export function deactivate() {}
