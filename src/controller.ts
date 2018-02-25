import { window } from "vscode";
import Path = require("path");
import { SpawnSyncOptions } from "child_process";
import { blame, getPullRequestNumber, findRemoteUrl } from "./git";

export class Controller {
  activeFileName(): string | undefined {
    return window.activeTextEditor && window.activeTextEditor.document.fileName;
  }

  activeDirName(): string | undefined {
    const fileName = this.activeFileName();
    return fileName && Path.dirname(fileName);
  }

  activeLineNumber(): number | undefined {
    return (
      window.activeTextEditor && window.activeTextEditor.selection.active.line
    );
  }

  gitExecOptions(): SpawnSyncOptions {
    return {
      cwd: this.activeDirName()
    };
  }

  async execute() {
    const options = this.gitExecOptions();
    const hash = blame(
      this.activeFileName(),
      this.activeLineNumber(),
      options
    );
    console.log("blame:", hash);
    const number = getPullRequestNumber(hash, options);
    console.log("PR:", number);
    console.log(findRemoteUrl(options));
  }
}
