export const CEO_PUBLISH_ERRORS = {
  commitMessage:
    "Publiceren is mislukt omdat de commit message niet veilig verwerkt werd. Atlas heeft dit gestopt voordat er iets gepusht is.",
  commitFailed:
    "Publiceren is mislukt tijdens het vastleggen van de release. Atlas heeft dit gestopt voordat er iets gepusht is.",
  stageFailed:
    "Publiceren is mislukt tijdens het voorbereiden van de release. Atlas heeft dit gestopt voordat er iets gepusht is.",
  pushNetwork:
    "Publiceren is mislukt door een netwerk- of rechtenprobleem. Atlas heeft dit gestopt — er is niets gepubliceerd.",
  pushFailed:
    "Publiceren is mislukt tijdens het vrijgeven. Atlas heeft dit gestopt — er is niets gepubliceerd.",
  verificationFailed:
    "Atlas kon de publicatie niet bevestigen. Er is mogelijk niets gepubliceerd — controleer de status voordat je opnieuw probeert.",
} as const;

export type GitOperationResult<T> = T & {
  ceoMessage?: string;
  internalError?: string;
};

function extractExecError(error: unknown): string {
  if (error instanceof Error) {
    const withOutput = error as Error & { stderr?: string; stdout?: string };
    return (withOutput.stderr ?? withOutput.stdout ?? error.message).trim();
  }
  return String(error);
}

export function mapCommitError(internalError: string): string {
  const normalized = internalError.toLowerCase();
  if (
    normalized.includes("syntax error") ||
    normalized.includes("unexpected token") ||
    normalized.includes("/bin/sh")
  ) {
    return CEO_PUBLISH_ERRORS.commitMessage;
  }
  return CEO_PUBLISH_ERRORS.commitFailed;
}

export function mapStageError(_internalError: string): string {
  return CEO_PUBLISH_ERRORS.stageFailed;
}

export function mapPushError(internalError: string): string {
  const normalized = internalError.toLowerCase();
  if (
    normalized.includes("permission denied") ||
    normalized.includes("authentication failed") ||
    normalized.includes("could not read from remote") ||
    normalized.includes("network") ||
    normalized.includes("failed to connect") ||
    normalized.includes("unable to access")
  ) {
    return CEO_PUBLISH_ERRORS.pushNetwork;
  }
  return CEO_PUBLISH_ERRORS.pushFailed;
}

export function logInternalPublishError(context: string, internalError: string): void {
  console.error(`[ceo-workflow] ${context}: ${internalError}`);
}

export function buildGitCommitArgs(message: string): string[] {
  const lines = message.split("\n");
  const subject = (lines[0] ?? message).trim();
  const body = lines.slice(1).join("\n").trim();

  if (body) {
    return ["commit", "-m", subject, "-m", body];
  }

  return ["commit", "-m", subject];
}

export { extractExecError };
