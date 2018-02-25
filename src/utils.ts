
export function buildOpenUrl(remoteUrl: string, prNumber: string | undefined): string {
  if (prNumber === undefined) {
    return `${remoteUrl}/${prNumber}`; // TODO: md5 support
  } else {
    return `${remoteUrl}/pull/${prNumber}/files`;
  }
}