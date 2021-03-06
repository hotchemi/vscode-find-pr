import { commands, ExtensionContext } from 'vscode';
import { findPullRequest } from './';
import { command } from './constants';

export function activate(context: ExtensionContext) {
  const disposable = commands.registerCommand(command, findPullRequest);
  context.subscriptions.push(disposable);
}

// tslint:disable-next-line:no-empty
export function deactivate() {}
