// A set of common options
import { Options } from 'yargs';

import { LogFormat, LogLevel } from '@hyperlane-xyz/utils';

export const logFormatCommandOption: Options = {
  type: 'string',
  description: 'Log output format',
  choices: Object.values(LogFormat),
};

export const logLevelCommandOption: Options = {
  type: 'string',
  description: 'Log verbosity level',
  choices: Object.values(LogLevel),
};

export const keyCommandOption: Options = {
  type: 'string',
  description:
    'A hex private key or seed phrase for transaction signing. Or use the HYP_KEY env var',
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

export const warpConfigOption: Options = {
  type: 'string',
  description: 'File path to Warp config',
  alias: 'w',
};

export const agentConfigurationOption: Options = {
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
