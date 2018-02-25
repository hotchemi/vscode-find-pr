import { commands, Uri } from "vscode";

export function openUrl(url: string) {
  commands.executeCommand("vscode.open", Uri.parse(url));
}
