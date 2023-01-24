import { GithubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
//import { GitlabDiscoveryEntityProvider } from '@backstage/plugin-catalog-backend-module-gitlab';
import { CatalogBuilder} from '@backstage/plugin-catalog-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
env: PluginEnvironment,
): Promise<Router> {
const builder = await CatalogBuilder.create(env);
builder.addEntityProvider(
  GithubEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    // optional: alternatively, use scheduler with schedule defined in app-config.yaml
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 30 },
      timeout: { minutes: 3 },
    }), 
  }),
)
// gitlab provider
//builder.addEntityProvider(
//  GitlabDiscoveryEntityProvider.fromConfig(env.config, {
//    logger: env.logger,
//    // optional: alternatively, use scheduler with schedule defined in app-config.yaml
//    schedule: env.scheduler.createScheduledTaskRunner({
//      frequency: { minutes: 2 },
//      timeout: { minutes: 3 },
//    }),
//    //scheduler: env.scheduler,
//  }),
//);

const { processingEngine, router } = await builder.build();
await processingEngine.start();
return router;
}