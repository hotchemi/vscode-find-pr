import { window } from "vscode";
import Path = require("path");
import { SpawnSyncOptions } from "child_process";

export class GitBlameController {
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
}
