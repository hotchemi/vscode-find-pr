import { commands, Uri } from "vscode";

function openUrl(url: string) {
  commands.executeCommand("vscode.open", Uri.parse(url));
}
