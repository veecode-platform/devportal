import { PluginEnvironment } from '../types';
import { Router } from 'express';
import {
  DatabaseRbacMigrations,
  createRouter,
} from '@internal/plugin-rbac-migrations-backend';

export default async function createPlugin({
  logger,
  database,
  config,
}: PluginEnvironment): Promise<Router> {
  const db = await DatabaseRbacMigrations.create({
    database: database,
    logger
  });
  return await createRouter({
    logger,
    database: db,
    config,
  });
}