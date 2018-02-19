import { window } from "vscode";
import Path = require("path");
import { SpawnSyncOptions, spawn } from "child_process";

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
    const filename = this.activeFileName();
    const line = this.activeLineNumber();
    const currentDir = this.activeDirName();
    const options = {
      cwd: currentDir
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
  }

  dispose(): void {}
}
