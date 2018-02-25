import { commands, Uri } from "vscode";
import { rootPath, activeFile } from "./editor";
import * as path from "path";
import * as crypto from "crypto";

export function relativeFilePath() {
  return path.relative(rootPath(), activeFile().uri.path);
}

export function md5(arg: string) {
  return crypto
    .createHash("md5")
    .update(arg)
    .digest("hex");
}

export function githubUrl(
  remoteUrl: string,
  pullRequestNo: string | undefined,
  hash: string,
  md5: string
): string {
  if (pullRequestNo === undefined) {
    return `${remoteUrl}/commit/${hash}#diff-${md5}`;
  } else {
    return `${remoteUrl}/pull/${pullRequestNo}/files#diff-${md5}`;
  }
}

export function openUrl(url: string) {
  commands.executeCommand("vscode.open", Uri.parse(url));
}
