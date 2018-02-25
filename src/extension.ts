import { commands, ExtensionContext } from "vscode";
import { Controller } from "./controller";
import { command } from "./constants";

export function activate(context: ExtensionContext) {
  const controller = new Controller();
  const disposable = commands.registerCommand(
    command,
    controller.execute,
    controller
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {
}
