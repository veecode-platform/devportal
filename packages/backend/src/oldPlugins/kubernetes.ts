import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { CatalogClient } from '@backstage/catalog-client';
import { VeecodeCatalogClusterLocator } from '../modules/kubernetes/customClusterLocator';
import { VeecodeCustomAuthStrategy } from '../modules/kubernetes/customClusterAuth';
import { AuthenticationStrategy } from '@backstage/plugin-kubernetes-node';


export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogApi = new CatalogClient({ discoveryApi: env.discovery });
  const customAuthStrategy: AuthenticationStrategy = new VeecodeCustomAuthStrategy()
  
  const builder = KubernetesBuilder.createBuilder({
    logger: env.logger,
    config: env.config,
    catalogApi,
    discovery: env.discovery,
    permissions: env.permissions,
  });
  builder.setAuthStrategyMap({
    "custom": customAuthStrategy
  })
  builder.addAuthStrategy("custom", customAuthStrategy);
  builder.setClusterSupplier(VeecodeCatalogClusterLocator.fromConfig(catalogApi));

  const { router } = await builder.build();

  return router;
}