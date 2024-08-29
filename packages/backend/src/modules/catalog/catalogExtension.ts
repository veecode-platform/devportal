import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { createBackendModule, coreServices } from '@backstage/backend-plugin-api';

import { GitlabFillerProcessor } from '@immobiliarelabs/backstage-plugin-gitlab-backend';
import { GitlabDiscoveryEntityProvider } from '@backstage/plugin-catalog-backend-module-gitlab';
import { ClusterEntitiesProcessor, DatabaseEntitiesProcessor, EnvironmentEntitiesProcessor, VaultEntitiesProcessor } from '@veecode-platform/plugin-veecode-platform-common';
import { InfracostEntityProcessor, InfracostEntityProvider } from '@veecode-platform/backstage-plugin-infracost-backend';

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
                cache: coreServices.cache,
                database: coreServices.database
            },
            async init({ catalog, config, scheduler, log, cache, database }) {

                //gitlab
                catalog.addEntityProvider(GitlabDiscoveryEntityProvider.fromConfig(config, {
                    logger: log,
                    scheduler: scheduler,
                }));
                catalog.addProcessor(new GitlabFillerProcessor(config));

                //infracost
                catalog.addEntityProvider(InfracostEntityProvider.fromConfig(config, {
                    id: "infracost-entity-provider",
                    logger: log,
                    cache: cache,
                    database: database
                }))
                catalog.addProcessor(new InfracostEntityProcessor(config, log, cache));

                //veecode custom entity processors
                catalog.addProcessor(new ClusterEntitiesProcessor())
                catalog.addProcessor( new EnvironmentEntitiesProcessor());
                catalog.addProcessor( new DatabaseEntitiesProcessor());
                catalog.addProcessor( new VaultEntitiesProcessor());
            },
        });
    },
});