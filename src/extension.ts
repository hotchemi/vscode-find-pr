import * as vscode from "vscode";
import { open } from "fs";
import { spawn } from "child_process";
import child_process = require("child_process");
import { GIT_COMMAND_IN_PATH } from "./constants";
const readline = require("readline");
import Path = require("path");
import { getPullRequestNumber, blame } from "./git/history";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("extension.sayHello", () => {
    const filename = vscode.window.activeTextEditor.document.fileName;
    const line = vscode.window.activeTextEditor.selection.active.line;
    const currentDirectory = Path.dirname(filename);
    const options = {
      cwd: currentDirectory
    };

    const blame = spawn(
      "git",
      ["blame", "--first-parent", "-L", `${line},${line}`, filename],
      options
    );
    const readline = require("readline");
    const lines = readline.createInterface({ input: blame.stdout });
    lines.on("line", input => {
      const [hash, content] = input.split(/ .*?\) /);
      console.log(hash);
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
