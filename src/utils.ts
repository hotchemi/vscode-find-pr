import * as crypto from 'crypto';
import * as path from 'path';
import { commands, Uri } from 'vscode';
import { activeFile, rootPath } from './editor';

export function relativeFilePath(): string | undefined {
  const root = rootPath();
  const file = activeFile();
  if (root === undefined || file === undefined) {
    return undefined;
  }
  return path.relative(root, file.uri.path);
}

export function md5(arg: string | undefined): string | undefined {
  if (arg == undefined) {
    return undefined;
  }
  return crypto
    .createHash('md5')
    .update(arg)
    .digest('hex');
}

export function githubUrl(
  remoteUrl: string,
  pullRequestNo: string | undefined,
  hash: string,
  md5Hash: string,
  showDescription: boolean,
): string {
  if (pullRequestNo === undefined) {
    return `${remoteUrl}/commit/${hash}#diff-${md5Hash}`;
  } else {
    const urlPath = showDescription ? undefined : `/files#diff-${md5Hash}`;
    return `${remoteUrl}/pull/${pullRequestNo}${urlPath}`;
  }
}

export function openUrl(url: string) {
  commands.executeCommand('vscode.open', Uri.parse(url));
}
