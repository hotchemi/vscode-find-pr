import { workspace } from 'vscode';

export const section = 'findpr';
export const command = `${section}.findPullRequest`;
export const remoteConfig = workspace.getConfiguration(section).get('remote', 'origin');
export const git = 'git';
export const open = 'Open';
