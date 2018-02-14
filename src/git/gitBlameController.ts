import { isWebUri } from "valid-url";
import { Disposable, commands, window, workspace, Uri } from "vscode";
import { ErrorHandler } from "../util/errorhandler";
import { TextDecorator } from "../util/textdecorator";
import { GitBlame } from "./blame";
import { Property, Properties } from "../util/property";
import { GitCommitInfo } from "../interfaces";
import { TITLE_VIEW_ONLINE } from "../constants";

export class GitBlameController {
  private disposable: Disposable;
  private gitBlame: GitBlame;

  constructor() {
    this.gitBlame = new GitBlame();
    this.setupDisposables();
  }

  setupDisposables(): void {
    const disposables: Disposable[] = [];

    // The controller does not use the ErrorHandler but
    // is responsible for keeping it disposable
    const errorHandler = ErrorHandler.getInstance();

    const propertyHolder = Property.getInstance();

    this.disposable = Disposable.from(
      this.gitBlame,
      errorHandler,
      propertyHolder
    );
  }

  private getCurrentActiveFileName(): string {
    return window.activeTextEditor && window.activeTextEditor.document.fileName;
  }

  private getCurrentActiveLineNumber(): number {
    return (
      window.activeTextEditor && window.activeTextEditor.selection.active.line
    );
  }

  async blameLink(): Promise<void> {
    const commitInfo = await this.getCommitInfo();
    const commitToolUrl = this.getToolUrl(commitInfo);

    if (commitToolUrl) {
      commands.executeCommand("vscode.open", commitToolUrl);
    } else {
      window.showErrorMessage(
        "Missing gitblame.commitUrl configuration value."
      );
    }
  }

  private async getCommitInfo(): Promise<GitCommitInfo> {
    let commitInfo = await this.gitBlame.getCurrentLineInfo();
    if (GitBlame.isGeneratedCommit(commitInfo)) {
      window.showErrorMessage("The current file and line can not be blamed.");
    }
    return commitInfo;
  }

  private getToolUrl(commitInfo: GitCommitInfo): Uri {
    if (GitBlame.isBlankCommit(commitInfo)) {
      return;
    }

    const parsedUrl = TextDecorator.parseTokens(
      Property.get(Properties.CommitUrl),
      {
        hash: commitInfo.hash
      }
    );

    if (isWebUri(parsedUrl)) {
      return Uri.parse(parsedUrl);
    } else if (parsedUrl) {
      window.showErrorMessage(
        "Malformed URL in setting gitblame.commitUrl. Must be a valid web url."
      );
    }
  }

  dispose(): void {
    this.disposable.dispose();
  }
}
