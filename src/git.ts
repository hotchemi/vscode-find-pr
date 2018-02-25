import {
  SpawnOptions,
  execFile,
  SpawnSyncOptions,
  spawnSync
} from "child_process";
import * as child_process from "child_process";
import { command, git } from "./constants";

export const blame = (
  filename: string,
  line: number,
  options: SpawnSyncOptions
): string | undefined => {
  const args = ["blame", "--first-parent", "-L", `${line},${line}`, filename];
  const ssr = spawnSync(git, args, options);
  const [hash, content] = ssr.stdout.toString().split(/ .*?\) /);
  return hash;
};

export const getPullRequestNumber = (
  hash: string,
  options: SpawnSyncOptions
): string | undefined => {
  const ssr = spawnSync(git, ["show", "--oneline", hash], options);
  const msg = /Merge\s+(?:pull\s+request|pr)\s+\#?(\d+)\s/i;
  const matcher = msg.exec(ssr.stdout.toString());
  return matcher ? matcher[1] : undefined;
};

export const findRemoteUrl = (options: SpawnSyncOptions): string | Error => {
  const stdout = spawnSync(git, ["remote"], options).stdout.toString();
  var remotes = stdout
    .replace(/,/g, "")
    .split(/\r\n|\r|\n/)
    .filter(Boolean);
  if (remotes.length > 1 || remotes.length === 0) {
    return new Error(
      "multiple or no remote candidates so that can't decide a base url."
    );
  }
  const remote = remotes.shift();
  return spawnSync(
    git,
    ["remote", "get-url", remote],
    options
  ).stdout.toString();
};
