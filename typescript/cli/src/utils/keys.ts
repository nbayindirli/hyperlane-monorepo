// NOTE: Rename to cli/utils/signer.ts ?
import { input } from '@inquirer/prompts';
import { ethers, providers } from 'ethers';

import { Address, ensure0x } from '@hyperlane-xyz/utils';

import { ContextSettings } from '../context.js';

import { impersonateAccount } from './fork.js';

/**
 * Retrieves a signer for the current command-context.
 * @returns the context-specific signer
 */
export async function getSigner<P extends ContextSettings>({
  keyConfig,
  skipConfirmation,
  dryRun,
}: P): Promise<providers.JsonRpcSigner | ethers.Wallet | undefined> {
  if (!keyConfig) return undefined;

  const keyType = dryRun ? 'public' : 'private';
  let key: string;
  if (keyConfig.key) key = keyConfig.key;
  else if (skipConfirmation) throw new Error(`No ${keyType} key provided`);
  else
    key = await input({
      message:
        keyConfig.promptMessage ||
        `Please enter a ${keyType} key or use the HYP_KEY environment variable.`,
    });

  return dryRun ? await publicKeyToSigner(key) : privateKeyToSigner(key);
}

/**
 * Verifes the specified signer is valid.
 * @param signer the signer to verify
 */
export function assertSigner(signer: ethers.Signer) {
  if (!signer || !ethers.Signer.isSigner(signer))
    throw new Error('Signer is invalid');
}

/**
 * Generates a signer from a public key.
 * @param key a public key
 * @returns a signer for the public key
 */
async function publicKeyToSigner(
  key: Address,
): Promise<providers.JsonRpcSigner> {
  if (!key) throw new Error('No public key provided');

  const formattedKey = key.trim().toLowerCase();
  if (ethers.utils.isHexString(ensure0x(formattedKey)))
    return await impersonateAccount(key);
  else throw new Error('Invalid public key format');
}

/**
 * Generates a signer from a private key.
 * @param key a private key
 * @returns a signer for the private key
 */
function privateKeyToSigner(key: string): ethers.Wallet {
  if (!key) throw new Error('No private key provided');

  const formattedKey = key.trim().toLowerCase();
  if (ethers.utils.isHexString(ensure0x(formattedKey)))
    return new ethers.Wallet(ensure0x(formattedKey));
  else if (formattedKey.split(' ').length >= 6)
    return ethers.Wallet.fromMnemonic(formattedKey);
  else throw new Error('Invalid private key format');
}
