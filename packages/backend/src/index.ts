import Router from 'express-promise-router';
import {
  createServiceBuilder,
  loadBackendConfig,
  getRootLogger,
  useHotMemoize,
  notFoundHandler,
  CacheManager,
  DatabaseManager,
  HostDiscovery,
  UrlReaders,
  ServerTokenManager,
} from '@backstage/backend-common';
import { TaskScheduler } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { metricsInit, metricsHandler } from './metrics';
import app from './plugins/app';
import auth from './plugins/auth';
import catalog from './plugins/catalog';
import scaffolder from './plugins/scaffolder';
import proxy from './plugins/proxy';
import techdocs from './plugins/techdocs';
import search from './plugins/search';
import healthcheck from './plugins/healthcheck';
// custom permission
import permission from './plugins/permission';
import vault from './plugins/vault';
import application from './plugins/application'
import { PluginEnvironment } from './types';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';
// argocd
import argocd from './plugins/argocd';
// kubernetes
import kubernetes from './plugins/kubernetes';
// gitlab
import gitlab from './plugins/gitlab';
// aws
import aws from './plugins/aws';
// explorer
import explore from './plugins/explore';
// about
import about from './plugins/about';
import { createAuthMiddleware } from './authMiddleware';
import cookieParser from 'cookie-parser';

function makeCreateEnv(config: Config) {
  const root = getRootLogger();
  const reader = UrlReaders.default({ logger: root, config });
  const discovery = HostDiscovery.fromConfig(config);
  const cacheManager = CacheManager.fromConfig(config);
  const databaseManager = DatabaseManager.fromConfig(config);
  const tokenManager = ServerTokenManager.fromConfig(config, { logger: root });
  const taskScheduler = TaskScheduler.fromConfig(config, { databaseManager });
  const permissions = ServerPermissionClient.fromConfig(config, {
    discovery,
    tokenManager,
  });
  const identity = DefaultIdentityClient.create({
    discovery,
  });

  root.info(`Created UrlReader ${reader}`);

  return (plugin: string): PluginEnvironment => {
    const logger = root.child({ type: 'plugin', plugin });
    const database = databaseManager.forPlugin(plugin);
    const cache = cacheManager.forPlugin(plugin);
    const scheduler = taskScheduler.forPlugin(plugin);
    /*const identity = DefaultIdentityClient.create({
      discovery,
    });*/
    return {
      logger,
      database,
      cache,
      config,
      reader,
      discovery,
      tokenManager,
      scheduler,
      permissions,
      identity
    };
  };
}

async function main() {
  metricsInit();
  const logger = getRootLogger();

  const config = await loadBackendConfig({
    argv: process.argv,
    logger
  });

  const createEnv = makeCreateEnv(config);

  const healthcheckEnv = useHotMemoize(module, () => createEnv('healthcheck'));
  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
  const scaffolderEnv = useHotMemoize(module, () => createEnv('scaffolder'));
  const authEnv = useHotMemoize(module, () => createEnv('auth'));
  const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));
  const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));
  const searchEnv = useHotMemoize(module, () => createEnv('search'));
  const appEnv = useHotMemoize(module, () => createEnv('app'));
  const permissionEnv = useHotMemoize(module, () => createEnv('permission'));
  const awsEnv = useHotMemoize(module, () => createEnv('aws'));
  const exploreEnv = useHotMemoize(module, () => createEnv('explore'));
  const aboutEnv = useHotMemoize(module, () => createEnv('about'));

  const authMiddleware = await createAuthMiddleware(config, appEnv);
  
  const apiRouter = Router();
  apiRouter.use(cookieParser());
  apiRouter.use('/auth', await auth(authEnv))
  apiRouter.use('/cookie', authMiddleware, (_req, res) => {
    res.status(200).send(`Coming right up`);
  });

  apiRouter.use('/explore', authMiddleware, await explore(exploreEnv));
  apiRouter.use('/catalog', authMiddleware, await catalog(catalogEnv));
  apiRouter.use('/scaffolder', authMiddleware, await scaffolder(scaffolderEnv));
  apiRouter.use('/proxy', authMiddleware, await proxy(proxyEnv));
  apiRouter.use('/techdocs', authMiddleware, await techdocs(techdocsEnv));
  apiRouter.use('/search', authMiddleware, await search(searchEnv));
  apiRouter.use('/permission', authMiddleware, await permission(permissionEnv));
  apiRouter.use('/techdocs', authMiddleware, await techdocs(techdocsEnv));
  apiRouter.use('/aws', authMiddleware, await aws(awsEnv));
  apiRouter.use('/about', authMiddleware, await about(aboutEnv));

  if (config.getOptionalBoolean("platform.apiManagement.enabled")) {
    const applicationEnv = useHotMemoize(module, () => createEnv('application'));
    apiRouter.use('/devportal', authMiddleware, await application(applicationEnv));
  }

  if (config.getOptionalBoolean("enabledPlugins.vault")) {
    const vaultEnv = useHotMemoize(module, () => createEnv('vault'));
    apiRouter.use('/vault', authMiddleware, await vault(vaultEnv));
  }
  if (config.getOptionalBoolean("enabledPlugins.kubernetes")) {
    const kubernetesEnv = useHotMemoize(module, () => createEnv('kubernetes'));
    apiRouter.use('/kubernetes', authMiddleware, await kubernetes(kubernetesEnv));
  }
  if (config.getOptionalBoolean("enabledPlugins.argocd")) {
    const argocdEnv = useHotMemoize(module, () => createEnv('argocd'));
    apiRouter.use('/argocd', authMiddleware, await argocd(argocdEnv));
  }

  if (config.getBoolean("enabledPlugins.gitlabPlugin")) {
    const gitlabEnv = useHotMemoize(module, () => createEnv('gitlab'));
    apiRouter.use('/gitlab', authMiddleware, await gitlab(gitlabEnv));
  }

  // Add backends ABOVE this line; this 404 handler is the catch-all fallback 
  apiRouter.use(authMiddleware, notFoundHandler());

  const service = createServiceBuilder(module)
    .loadConfig(config)
    .addRouter('', await healthcheck(healthcheckEnv))
    .addRouter('', metricsHandler())
    .addRouter('/api', apiRouter)
    .addRouter('', await app(appEnv));

  await service.start().catch(err => {
    console.log(err);
    process.exit(1);
  });

  apiRouter.stack
    .map(r => r.regexp)
    .forEach(endpoint => logger.debug(`Endpoint: ${endpoint}`));
}

module.hot?.accept();
main().catch(error => {
  console.error(`Backend failed to start up, ${error}`);
  process.exit(1);
});
