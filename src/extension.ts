import { commands, ExtensionContext } from "vscode";
import { Controller } from "./controller";

export function activate(context: ExtensionContext) {
  const controller = new Controller();
  const disposable = commands.registerCommand(
    "extension.sayHello",
    controller.execute,
    controller
  );
  context.subscriptions.push(controller, disposable);
}

export function deactivate() {}
