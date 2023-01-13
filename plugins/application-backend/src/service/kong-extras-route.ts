import { Router } from "express";
import { RouterOptions } from "./router";
import { KongHandler } from "../modules/kong-control/KongHandler";
import { KongServiceBase } from "../modules/kong/services/KongServiceBase";

/** @public */
export async function createKongRouter(
  options: RouterOptions,
): Promise<Router> {

  const router = Router()
  const kongHandler = new KongHandler()
  const kongServiceBase = new KongServiceBase()


  router.get(
    '/plugins/:serviceName',
    async (req, resp) => {
      try {
        const serviceStore = await kongHandler.listPluginsService(
          await kongServiceBase.getUrl(),
          req.params.serviceName
        );
        resp.json({ status: 'ok', services: serviceStore });
      } catch (error: any) {
        console.log(error)
        let date = new Date();
        resp.status(error.response).json({
          status: 'ERROR',
          message: error.response,
          timestamp: new Date(date).toISOString(),
        });
      }
    },
  );

  router.get('/services', async (_, res) => {
    try {
      const serviceStore = await kongHandler.listServices(await kongServiceBase.getUrl());
      if (serviceStore)
        res.json({ status: 'ok', services: serviceStore });
    } catch (error: any) {
      let date = new Date();
      res
        .status(error.response.status)
        .json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString()
        })
    }
  });

  router.get('/routes', async (_, res) => {
    try {
      const serviceStore = await kongHandler.listRoutes(await kongServiceBase.getUrl());
      if (serviceStore)
        res.json({ status: 'ok', routes: serviceStore });
    } catch (error: any) {
      let date = new Date();
      res
        .status(error.response.status)
        .json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString()
        })
    }
  });

  router.get('/consumers', async (_, res) => {
    try {
      const serviceStore = await kongHandler.listConsumers(await kongServiceBase.getUrl());
      if (serviceStore)
        res.status(200).json({ status: 'ok', costumer: serviceStore });

    } catch (error: any) {
      let date = new Date();
      console.log(error)
      res
        .status(error.response.status)
        .json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString()
        })
    }
  });
  router.post('/credential/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const serviceStore = await kongHandler.generateCredential(
        await kongServiceBase.getUrl(),
        id,
      );
      res.status(201).json({ status: 'ok', response: serviceStore });
    } catch (error: any) {
      let date = new Date();
      return res.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.message,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.get('/credential/:idApplication', async (req, res) => {
    try {
      const id = req.params.idApplication;
      const serviceStore = await kongHandler.listCredentialWithApplication(
        options,
        await kongServiceBase.getUrl(),
        id
      );
      res.status(200).json({ status: 'ok', credentials: serviceStore });
    } catch (error: any) {
      let date = new Date();
      return res.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.message,
        timestamp: new Date(date).toISOString(),
      });
    }
  });




  return router;
}