import { GasRouter } from '@hyperlane-xyz/core';
import { Address } from '@hyperlane-xyz/utils';

import { HyperlaneContracts, HyperlaneContractsMap } from '../contracts/types';
import { ChainMap } from '../types';

import { ProxiedRouterDeployer } from './ProxiedRouterDeployer';
import { GasRouterConfig, ProxiedFactories } from './types';

export abstract class GasRouterDeployer<
  Config extends GasRouterConfig,
  Factories extends ProxiedFactories,
> extends ProxiedRouterDeployer<Config, Factories> {
  abstract router(contracts: HyperlaneContracts<Factories>): GasRouter;

  async enrollRemoteRouters(
    contractsMap: HyperlaneContractsMap<Factories>,
    configMap: ChainMap<Config>,
    foreignRouters: ChainMap<Address> = {},
  ): Promise<void> {
    await super.enrollRemoteRouters(contractsMap, configMap, foreignRouters);

    this.logger.debug(`Setting enrolled router destination gas...`);
    for (const [chain, contracts] of Object.entries(contractsMap)) {
      const remoteDomains = await this.router(contracts).domains();
      const remoteChains = remoteDomains.map((domain) =>
        this.multiProvider.getChainName(domain),
      );
      const currentConfigs = await Promise.all(
        remoteDomains.map((domain) =>
          this.router(contracts).destinationGas(domain),
        ),
      );
      const remoteConfigs = remoteDomains
        .map((domain, i) => ({
          domain,
          gas: configMap[remoteChains[i]].gas,
        }))
        .filter(({ gas }, index) => !currentConfigs[index].eq(gas));
      if (remoteConfigs.length == 0) {
        continue;
      }

      this.logger.debug(`Set destination gas on ${chain} for ${remoteChains}`);
      await this.multiProvider.handleTx(
        chain,
        this.router(contracts)['setDestinationGas((uint32,uint256)[])'](
          remoteConfigs,
        ),
      );
    }
  }
}
