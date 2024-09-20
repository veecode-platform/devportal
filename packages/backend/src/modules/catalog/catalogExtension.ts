import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { createBackendModule, coreServices } from '@backstage/backend-plugin-api';

import { GitlabFillerProcessor } from '@immobiliarelabs/backstage-plugin-gitlab-backend';
import { GitlabDiscoveryEntityProvider } from '@backstage/plugin-catalog-backend-module-gitlab';

export const catalogModuleCustomExtensions = createBackendModule({
    pluginId: 'catalog',
    moduleId: 'veecode-platform-custom-extensions',
    register(env) {
        env.registerInit({
            deps: {
                catalog: catalogProcessingExtensionPoint,
                config: coreServices.rootConfig,
                scheduler: coreServices.scheduler,
                log: coreServices.logger,
            },
            async init({ catalog, config, scheduler, log }) {

                //gitlab
                catalog.addEntityProvider(GitlabDiscoveryEntityProvider.fromConfig(config, {
                    logger: log,
                    scheduler: scheduler,
                }));
                catalog.addProcessor(new GitlabFillerProcessor(config));

            },
        });
    },
});