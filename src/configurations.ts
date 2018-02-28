import { workspace } from 'vscode';
import { section } from './constants';

export const remoteConfig = workspace
  .getConfiguration(section)
  .get('remote', 'origin');

export const showDescriptionConfig = workspace
  .getConfiguration(section)
  .get('showDescription', false);
