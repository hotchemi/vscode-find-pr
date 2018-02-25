import { execFile, SpawnSyncOptions, spawnSync } from "child_process";
import * as child_process from "child_process";
import { command, git } from "./constants";

export function execOptions(cwd: string): SpawnSyncOptions {
  return {
    cwd
  };
}

export const blame = (
  filename: string,
  line: number,
  options: SpawnSyncOptions
): string | undefined => {
  const args = [
    "blame",
    "--first-parent",
    "-l",
    "-L",
    `${line},${line}`,
    filename
  ];
  const ssr = spawnSync(git, args, options);
  const [hash, content] = ssr.stdout.toString().split(/ .*?\) /);
  return hash.replace(/\^/g, ""); // trim like ^518289f318721509f49e5951d537f33d45532d8
};

export const getPullRequestNumber = (
  hash: string,
  options: SpawnSyncOptions
): string | undefined => {
  const ssr = spawnSync(git, ["show", "--oneline", hash], options);
  const grep = /Merge\s+(?:pull\s+request|pr)\s+\#?(\d+)\s/i;
  const matcher = grep.exec(ssr.stdout.toString());
  return matcher && matcher.length > 1 ? matcher[1] : undefined;
};

export const findRemoteUrl = (options: SpawnSyncOptions): string | Error => {
  const stdout = spawnSync(git, ["remote"], options).stdout.toString();
  var remotes = stdout
    .replace(/,/g, "")
    .split(/\r\n|\r|\n/)
    .filter(Boolean);
  if (remotes.length > 1 || remotes.length === 0) {
    return new Error("multiple remote repos has been registered.");
  } else if (remotes.length === 0) {
    return new Error("No remote repo has been registered.");
  }
  const remote = remotes.shift();
  return spawnSync(
    git,
    ["remote", "get-url", remote],
    options
  ).stdout.toString();
};
