import {
    makeLegacyPlugin,
    loggerToWinstonLogger,
  } from '@backstage/backend-common';
  import { coreServices } from '@backstage/backend-plugin-api';

  export const legacyPlugin = makeLegacyPlugin(
    {
      cache: coreServices.cache,
      config: coreServices.rootConfig,
      database: coreServices.database,
      discovery: coreServices.discovery,
      logger: coreServices.logger,
      permissions: coreServices.permissions,
      scheduler: coreServices.scheduler,
      tokenManager: coreServices.tokenManager,
      reader: coreServices.urlReader,
      identity: coreServices.identity,
    },
    {
      logger: log => loggerToWinstonLogger(log),
    },
  );