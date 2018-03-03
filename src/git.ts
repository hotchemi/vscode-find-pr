import { spawnSync, SpawnSyncOptions } from 'child_process';
import { remoteConfig } from './configurations';
import { git } from './constants';

export function execOptions(cwd: string): SpawnSyncOptions {
  return {
    cwd,
  };
}

export const blame = (
  filename: string,
  line: number,
  options: SpawnSyncOptions,
): string | undefined => {
  const args = [
    'blame',
    '--first-parent',
    '-l',
    '-L',
    `${line},${line}`,
    filename,
  ];
  const ssr = spawnSync(git, args, options);
  const [hash] = ssr.stdout.toString().split(/ .*?\) /);
  return hash.replace(/\^/g, ''); // trim like ^518289f318721509f49e5951d537f33d45532d8
};

export const getPullRequestNo = (
  hash: string,
  options: SpawnSyncOptions,
): string | undefined => {
  const ssr = spawnSync(git, ['show', '--oneline', hash], options);
  const grep = /Merge\s+(?:pull\s+request|pr)\s+\#?(\d+)\s/i;
  const matcher = grep.exec(ssr.stdout.toString());
  return matcher && matcher.length > 1 ? matcher[1] : undefined;
};

export const findRemoteUrl = (options: SpawnSyncOptions): string | Error => {
  const stdout = spawnSync(git, ['remote'], options).stdout.toString();
  const remotes = stdout
    .replace(/,/g, '')
    .split(/\r\n|\r|\n/)
    .filter(Boolean);
  const index = remotes.indexOf(remoteConfig);
  if (index === -1) {
    return new Error('Could not find configured remote repository.');
  }
  const url = spawnSync(
    git,
    ['remote', 'get-url', remotes[index]],
    options,
  ).stdout.toString().trim();
  if (url.startsWith(git)) {
    return convertToHttpsSchema(url);
  }
  return url;
};

export const convertToHttpsSchema = (url: string): string => {
  return url
    .replace(/^git@/, 'https://')
    .replace('github.com:', 'github.com/')
    .replace(/\.git$/, '');
};
