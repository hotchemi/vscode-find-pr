import { workspace } from 'vscode';
import { section } from './constants';

export const remoteUri = workspace.getConfiguration(section).get('remoteUri');
