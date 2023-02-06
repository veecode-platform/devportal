 import { GithubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
 import { CatalogBuilder} from '@backstage/plugin-catalog-backend';
 import { Router } from 'express';
 import { PluginEnvironment } from '../types';
 import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
 // Bitbucket Cloud
 //import { BitbucketCloudEntityProvider } from '@backstage/plugin-catalog-backend-module-bitbucket-cloud';
// Bitbucket Server
//import { BitbucketServerEntityProvider } from '@backstage/plugin-catalog-backend-module-bitbucket-server';

 export default async function createPlugin(
 env: PluginEnvironment,
 ): Promise<Router> {
 const builder = await CatalogBuilder.create(env);
 builder.addEntityProvider(
   GithubEntityProvider.fromConfig(env.config, {
     logger: env.logger,
     // optional: alternatively, use scheduler with schedule defined in app-config.yaml
     schedule: env.scheduler.createScheduledTaskRunner({
       frequency: { minutes: 1 },
       timeout: { minutes: 3 },
     }),  
   }),
  );

//  builder.addEntityProvider(
//    BitbucketCloudEntityProvider.fromConfig(env.config, {
//      logger: env.logger,
//     schedule: env.scheduler.createScheduledTaskRunner({
//         frequency: { minutes: 1 },
//         timeout: { minutes: 3 },
//       }),
//    }),
//  )
//
//  builder.addEntityProvider(
//    BitbucketServerEntityProvider.fromConfig(env.config, {
//          logger: env.logger,
//          // optional: alternatively, use scheduler with schedule defined in app-config.yaml
//          schedule: env.scheduler.createScheduledTaskRunner({
//            frequency: { minutes: 1 },
//            timeout: { minutes: 3 },
//          }),
//          // optional: alternatively, use schedule
//          // scheduler: env.scheduler,
//        }),
//  )
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

 builder.addProcessor(new ScaffolderEntitiesProcessor());
 const { processingEngine, router } = await builder.build();
 await processingEngine.start();
 return router;
 }
