import { input } from '@inquirer/prompts';
import { ethers, providers } from 'ethers';

import { Address, ensure0x } from '@hyperlane-xyz/utils';

import { ContextSettings } from '../context.js';

import { impersonateAccount } from './fork.js';

const ETHEREUM_ADDRESS_LENGTH = 42;

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

  const keyType = dryRun ? 'address' : 'private key';
  let key: string;
  if (keyConfig.key) key = keyConfig.key;
  else if (skipConfirmation) throw new Error(`No ${keyType} provided`);
  else
    key = await input({
      message:
        keyConfig.promptMessage ||
        `Please enter ${keyType} or use the HYP_KEY environment variable.`,
    });

  return dryRun ? await addressToSigner(key) : privateKeyToSigner(key);
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
 * Generates a signer from an address.
 * @param address an EOA address
 * @returns a signer for the address
 */
async function addressToSigner(
  address: Address,
): Promise<providers.JsonRpcSigner> {
  if (!address) throw new Error('No address provided');

  const formattedKey = address.trim().toLowerCase();
  if (address.length != ETHEREUM_ADDRESS_LENGTH)
    throw new Error(
      'Invalid address length. Please ensure you are passing an address and not a private key.',
    );
  else if (ethers.utils.isHexString(ensure0x(formattedKey)))
    return await impersonateAccount(address);
  else throw new Error('Invalid address format');
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
