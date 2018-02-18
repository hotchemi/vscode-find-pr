import { spawnSync, SpawnSyncOptions, spawn, SpawnOptions } from "child_process";

export const getPullRequestNumber = (
  hash: string,
  options?: SpawnSyncOptions
): string | undefined => {
  const ret = spawnSync("git", ["show", "--oneline", hash], options);
  const stdout = ret.stdout.toString();
  const msg = /Merge\s+(?:pull\s+request|pr)\s+\#?(\d+)\s/i;
  const matcher = msg.exec(stdout);
  return matcher ? matcher[1] : undefined;
};

export const blame = (
  filename: string,
  line: number,
  options?: SpawnOptions
) => {
  const blame = spawn(
    "git",
    ["blame", "--first-parent", "-L", `${line},${line}`, filename],
    options
  );
  const readline = require("readline");
  const lines = readline.createInterface({ input: blame.stdout });
  lines.on("line", input => {
    const [hash, content] = input.split(/ .*?\) /);
    console.log(hash);
  });
};
