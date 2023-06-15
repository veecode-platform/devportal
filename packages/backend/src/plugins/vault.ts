import { VaultBuilder } from '@veecode-platform/plugin-vault-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await VaultBuilder.createBuilder({
    logger: env.logger,
    config: env.config,
    scheduler: env.scheduler,
  }).enableTokenRenew(
    env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 10 },
      timeout: { minutes: 1 },
    }),
  );

  const { router } = builder.build();

  return router;
}