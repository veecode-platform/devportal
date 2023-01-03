import { PluginDatabaseManager, errorHandler } from "@backstage/backend-common";
import { Config } from "@backstage/config";
import { Logger } from "winston";
import express, { request, response } from 'express';
import Router from 'express-promise-router';

/** @public */
export interface RouterOptions {
    logger: Logger;
    database: PluginDatabaseManager;
    config: Config;
  }
/** @public */
export async function createRouter(
    options: RouterOptions,
  ): Promise<express.Router> {


  const router = Router();
  router.use(express.json());


  router.get('/teste', async (request, response) => {
    console.log('HERE')
    response.status(200).json({status: 'ok'})
  })


    router.use(errorHandler())
    return router;



  }