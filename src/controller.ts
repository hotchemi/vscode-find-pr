import { window } from "vscode";
import { blame, getPullRequestNumber, findRemoteUrl, execOptions } from "./git";
import { githubUrl, openUrl, relativeFilePath, md5 } from "./utils";
import { isEmpty } from "lodash";
import {
  activeFile,
  activeLineNumber,
  isActiveEditorValid,
  rootPath
} from "./editor";

export class Controller {
  execute() {
    if (!isActiveEditorValid()) {
      window.showErrorMessage("Could not find active titled document.");
      return;
    }

    const root = rootPath();
    if (root === undefined) {
      window.showErrorMessage("No folder has been opened.");
      return;
    }

    const options = execOptions(root);
    const remoteUrl = findRemoteUrl(options);
    if (remoteUrl instanceof Error) {
      window.showErrorMessage(remoteUrl.message);
      return;
    }

    const file = activeFile();
    const line = activeLineNumber();
    if (file === undefined || line === undefined) {
      window.showErrorMessage("Could not find active document.");
      return;
    }

    const hash = blame(file.fileName, line, options);
    if (hash === undefined || isEmpty(hash)) {
      window.showErrorMessage("Could not find revision hash.");
      return;
    }

    const pullRequestNo = getPullRequestNumber(hash, options);
    const md5Hash = md5(relativeFilePath());
    const url = githubUrl(remoteUrl, pullRequestNo, hash, md5Hash);
    if (pullRequestNo === undefined) {
      window
        .showInformationMessage(
          "Could not find related pull requet. Open the commit page."
        )
        .then(selection => {
          openUrl(url);
        });
    } else {
      openUrl(url);
    }
  }
}
