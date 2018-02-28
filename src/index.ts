import { isEmpty } from 'lodash';
import { window } from 'vscode';
import { open, showDescriptionConfig } from './constants';
import {
  activeFile,
  activeLineNumber,
  isActiveEditorValid,
  rootPath,
} from './editor';
import { blame, execOptions, findRemoteUrl, getPullRequestNo } from './git';
import { githubUrl, md5, openUrl, relativeFilePath } from './utils';

export function findPullRequest() {
  if (!isActiveEditorValid()) {
    window.showErrorMessage('Could not find active titled document.');
    return;
  }

  const root = rootPath();
  if (root === undefined) {
    window.showErrorMessage('No folder has been opened.');
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
    window.showErrorMessage('Could not find active document.');
    return;
  }

  const hash = blame(file.fileName, line, options);
  if (hash === undefined || isEmpty(hash)) {
    window.showErrorMessage('Could not find revision hash.');
    return;
  }

  const pullRequestNo = getPullRequestNo(hash, options);
  const md5Hash = md5(relativeFilePath());
  if (md5Hash === undefined) {
    window.showErrorMessage('Could not generate md5 hash.');
    return;
  }

  const url = githubUrl(remoteUrl, pullRequestNo, hash, md5Hash, showDescriptionConfig);
  if (pullRequestNo === undefined) {
    window
      .showInformationMessage(
        'Could not find related pull requet. Open the commit page.',
        open,
      )
      .then(selection => {
        if (selection === open) {
          openUrl(url);
        }
      });
  } else {
    openUrl(url);
  }
}
