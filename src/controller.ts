import { window } from "vscode";
import Path = require("path");
import { SpawnSyncOptions } from "child_process";
import { blame, getPullRequestNumber, findRemoteUrl } from "./git";
import { openUrl } from "./browser";
import { buildOpenUrl } from "./utils";

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
    const remoteUrl = findRemoteUrl(options);
    if (remoteUrl instanceof Error) {
      window.showErrorMessage(remoteUrl.message);
      return;
    }
    const hash = blame(this.activeFileName(), this.activeLineNumber(), options);
    const prNumber = getPullRequestNumber(hash, options);
    const url = buildOpenUrl(remoteUrl, prNumber);
    openUrl(url);
  }
}
