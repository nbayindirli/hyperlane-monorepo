import { MultiProvider } from '@hyperlane-xyz/sdk';

import { logYellow } from '../../logger.js';
import { ANVIL_RPC_METHODS, getLocalProvider, setFork } from '../utils/fork.js';

/**
 * Prepares the MultiProvider for a command being dry-run
 * @param multiProvider the MultiProvider to be prepared
 * @param chains the chain selection passed-in by the user
 */
export async function prepareMultiProviderForDryRun(
  multiProvider: MultiProvider,
  chains: string[],
) {
  if (chains.length != 1)
    throw new Error('Only one chain can be present for dry-running.');
  const chain = chains[0];
  multiProvider = multiProvider.extendChainMetadata({
    [chain]: { blocks: { confirmations: 0 } },
  });
  await setFork(multiProvider, chain);
}

/**
 * Ensures an anvil node is running locally.
 */
export async function verifyAnvil() {
  const provider = getLocalProvider();
  try {
    await provider.send(ANVIL_RPC_METHODS.NODE_INFO, []);
  } catch (error: any) {
    if (error.message.includes('missing response'))
      throw new Error(`No active anvil node detected.
\tRun \`./hyperlane-monorepo/typescript/cli/anvil-start.sh\` or \`anvil\` in a separate instance to dry-run.`);
  }
}
/**
 * Evaluates if an error is related to the current dry-run.
 * @param error the thrown error
 * @param dryRun whether or not the current command is being dry-run
 */
export function evaluateIfDryRunFailure(error: any, dryRun: boolean) {
  if (dryRun && error.message.includes('underlying network changed'))
    logYellow(
      '⚠️ (Dry-run) Anvil node may be out of sync due to CORS. Please disable CORS via `anvil --no-cors`.',
    );
}
