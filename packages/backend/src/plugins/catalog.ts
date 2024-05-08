import { GithubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-catalog-backend-module-scaffolder-entity-model';
// Bitbucket Cloud
//import { BitbucketCloudEntityProvider } from '@backstage/plugin-catalog-backend-module-bitbucket-cloud';
// Bitbucket Server
//import { BitbucketServerEntityProvider } from '@backstage/plugin-catalog-backend-module-bitbucket-server';
// Gitlab
import { GitlabFillerProcessor } from '@immobiliarelabs/backstage-plugin-gitlab-backend';
import { GitlabDiscoveryEntityProvider } from '@backstage/plugin-catalog-backend-module-gitlab';
// Keycloak Orgs
// @ts-ignore
import { KeycloakOrgEntityProvider } from '@janus-idp/backstage-plugin-keycloak-backend';
import { ClusterEntitiesProcessor, DatabaseEntitiesProcessor, EnvironmentEntitiesProcessor, VaultEntitiesProcessor } from '@veecode-platform/plugin-veecode-platform-common';
// Azure
import { AzureDevOpsAnnotatorProcessor } from '@backstage/plugin-azure-devops-backend';
//import {
//  LibraryCheckUpdaterProcessor,
//  LibraryCheckProcessor,
//  LibraryCheckProvider,
//} from '@anakz/backstage-plugin-library-check-backend';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.addEntityProvider(
    GithubEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      scheduler: env.scheduler,
      /* schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 10 },
        timeout: { minutes: 3 },
      }),*/
    }),
  );

  //builder.addEntityProvider(
  //  BitbucketCloudEntityProvider.fromConfig(env.config, {
  //    logger: env.logger,
  //    scheduler: env.scheduler,
  //    /* schedule: env.scheduler.createScheduledTaskRunner({
  //      frequency: { minutes: 10 },
  //      timeout: { minutes: 3 },
  //    }),*/
  //  }),
  //)
//
  //builder.addEntityProvider(
  //  BitbucketServerEntityProvider.fromConfig(env.config, {
  //    logger: env.logger,
  //    scheduler: env.scheduler,
  //    /* schedule: env.scheduler.createScheduledTaskRunner({
  //      frequency: { minutes: 10 },
  //      timeout: { minutes: 3 },
  //    }),*/
  //  }),
  //)

  // gitlab provider
  if (env.config.getBoolean("enabledPlugins.gitlabPlugin")) {
    builder.addEntityProvider(
      ...GitlabDiscoveryEntityProvider.fromConfig(env.config, {
        logger: env.logger,
        scheduler: env.scheduler,
        /* schedule: env.scheduler.createScheduledTaskRunner({
          frequency: { minutes: 10 },
          timeout: { minutes: 3 },
        }),*/      
      }),
    );
    builder.addProcessor(new GitlabFillerProcessor(env.config));
  }

  // keycloak
  if (env.config.getBoolean("enabledPlugins.keycloak")) {
  builder.addEntityProvider(
    KeycloakOrgEntityProvider.fromConfig(env.config, {
      id: 'development',
      logger: env.logger,
      scheduler: env.scheduler,
      /* schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 10 },
        timeout: { minutes: 1 },
      }),*/
    }),
  );
  }

// // Library Check  
//  LibraryCheckProvider.fromConfig({
//    envId: 'production',
//    logger: env.logger,
//    discovery: env.discovery,
//    schedule: env.scheduler.createScheduledTaskRunner({
//      initialDelay: {
//        seconds: 190,
//      },
//      frequency: {
//        minutes: 15,
//      },
//      timeout: {
//        minutes: 3,
//      },
//    }),
//  }),
//
//
//builder.addProcessor(
//  LibraryCheckProcessor.fromConfig(env.config, {
//    discoveryService: env.discovery,
//    reader: env.reader,
//    logger: env.logger,
//  }),
//
//  LibraryCheckUpdaterProcessor.fromConfig(env.config, {
//    discoveryService: env.discovery,
//    reader: env.reader,
//    logger: env.logger,
//  }),
//);

  // Azure Devops Plugin
  if (env.config.getBoolean("enabledPlugins.azureDevops"))  builder.addProcessor(AzureDevOpsAnnotatorProcessor.fromConfig(env.config));

  builder.addProcessor( new ClusterEntitiesProcessor());
  builder.addProcessor( new EnvironmentEntitiesProcessor());
  builder.addProcessor( new DatabaseEntitiesProcessor());
  builder.addProcessor( new VaultEntitiesProcessor());

  builder.addProcessor(new ScaffolderEntitiesProcessor());
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
