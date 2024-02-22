/* TODO: Create common/options.ts, common/args.ts, agent/options.ts, etc. */
import { ArgumentsCamelCase, Options } from 'yargs';

type CommandOptions = {
  chains: Options;
};
export type AgentCommandOptions = CommandOptions & {
  origin: Options;
  targets: Options;
  config: Options;
};
export type CoreCommandOptions = CommandOptions & {
  targets: Options;
  artifacts: Options;
  ism: Options;
  hook: Options;
  out: Options;
  key: Options;
  yes: Options;
  'dry-run': Options;
};
export type WarpCommandOptions = CommandOptions & {
  config: Options;
  core: Options;
  out: Options;
  key: Options;
  yes: Options;
};

interface CommandArgs extends ArgumentsCamelCase {
  chains: string;
}
export interface AgentCommandArgs extends CommandArgs {
  origin: string;
  targets: string;
  config: string;
}
export interface CoreCommandArgs extends CommandArgs {
  targets: string;
  artifacts: string;
  ism: string;
  hook: string;
  out: string;
  key: string;
  yes: boolean;
  'dry-run': boolean;
}
export type WarpCommandArgs = CommandArgs & {
  config: string;
  core: string;
  out: string;
  key: string;
  yes: boolean;
};

export const coreTargetsCommandOption: Options = {
  type: 'string',
  description:
    'Comma separated list of chain names to which contracts will be deployed',
};

export const agentTargetsCommandOption: Options = {
  type: 'string',
  description: 'Comma separated list of chains to relay between',
};

export const originCommandOption: Options = {
  type: 'string',
  description: 'The name of the origin chain to deploy to',
};

export const ismCommandOption: Options = {
  type: 'string',
  description:
    'A path to a JSON or YAML file with basic or advanced ISM configs (e.g. Multisig)',
};

export const hookCommandOption: Options = {
  type: 'string',
  description:
    'A path to a JSON or YAML file with Hook configs (for every chain)',
};

export const warpConfigCommandOption: Options = {
  type: 'string',
  description: 'A path to a JSON or YAML file with a warp config.',
  default: './configs/warp-tokens.yaml',
};

export const keyCommandOption: Options = {
  type: 'string',
  description: `Default: A hex private key or seed phrase for transaction signing, or use the HYP_KEY env var.
Dry-run: A hex public key to simulate transaction signing on a forked network, or use the HYP_KEY env var.`,
  alias: 'k',
};

export const chainsCommandOption: Options = {
  type: 'string',
  description: 'A path to a JSON or YAML file with chain configs',
  default: './configs/chains.yaml',
  alias: 'c',
};

export const outDirCommandOption: Options = {
  type: 'string',
  description: 'A folder name output artifacts into',
  default: './artifacts',
  alias: 'o',
};

export const coreArtifactsOption: Options = {
  type: 'string',
  description: 'File path to core deployment output artifacts',
  alias: 'a',
};

export const agentConfigCommandOption: Options = {
  type: 'string',
  description: 'File path to agent configuration artifacts',
};

export const fileFormatOption: Options = {
  type: 'string',
  description: 'Output file format',
  choices: ['json', 'yaml'],
  default: 'yaml',
  alias: 'f',
};

export const outputFileOption = (defaultPath: string): Options => ({
  type: 'string',
  description: 'Output file path',
  default: defaultPath,
  alias: 'o',
});

export const skipConfirmationOption: Options = {
  type: 'boolean',
  description: 'Skip confirmation prompts',
  default: false,
  alias: 'y',
};

export const dryRunOption: Options = {
  type: 'boolean',
  description:
    'Simulate deployment on forked network. Please ensure an anvil node instance is running during execution with CORS disabled (--no-cors).',
  default: false,
  alias: 'd',
};
