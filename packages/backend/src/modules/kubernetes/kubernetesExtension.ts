import { createBackendModule, coreServices } from '@backstage/backend-plugin-api';
import { kubernetesClusterSupplierExtensionPoint, kubernetesAuthStrategyExtensionPoint, AuthenticationStrategy } from '@backstage/plugin-kubernetes-node';
import { CatalogClient } from '@backstage/catalog-client';
import { VeecodeCustomAuthStrategy } from './customClusterAuth';
import { VeecodeCatalogClusterLocator } from './customClusterLocator';

export const kubernetesModuleCustomExtension = createBackendModule({
    pluginId: 'kubernetes',
    moduleId: 'custom-locator',
    register(env) {
      env.registerInit({
        deps: {
          locator: kubernetesClusterSupplierExtensionPoint,
          authStrategy: kubernetesAuthStrategyExtensionPoint,
          discovery: coreServices.discovery,
          auth: coreServices.auth          
        },
        async init({ locator, discovery, auth, authStrategy }) {
          const catalogApi = new CatalogClient({ discoveryApi: discovery });
          const customAuth: AuthenticationStrategy = new VeecodeCustomAuthStrategy();
  
          //locator.addClusterSupplier(VeecodeCatalogClusterLocator.fromConfig(catalogApi, auth));
  
          //authStrategy.addAuthStrategy("custom", customAuth)
        },
      });
    },
  });