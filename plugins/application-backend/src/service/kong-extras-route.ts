import { Router } from "express";
import { RouterOptions } from "./router";
import { KongHandler } from "../modules/kong-control/KongHandler";
import { KongServiceBase } from "../modules/kong/services/KongServiceBase";
import { AclPlugin } from "../modules/kong/plugins/AclPlugin";
const aclPlugin = AclPlugin.Instance;

/** @public */
export async function createKongRouter(
  options: RouterOptions,
): Promise<Router> {

  const router = Router()
  const kongHandler = new KongHandler()
  const kongServiceBase = new KongServiceBase()


  router.post(
    '/plugin/:serviceName',
    async (request, response) => {
      try {
        const serviceStore = await aclPlugin.configAclKongService(
          request.params.serviceName,
          request.body.config.allow,
        );
        if (serviceStore)
          response.json({ status: 'ok', plugins: serviceStore });
        response.json({ status: 'ok', services: [] });
      } catch (error: any) {
        let date = new Date();
        console.log(error);
        response.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.message,
          timestamp: new Date(date).toISOString(),
        });
      }
    },
  );

  router.patch(
    '/plugin/:serviceName/:pluginId',
    async (request, response) => {
      try {
        const serviceStore = await aclPlugin.updateAclKongService(
          request.params.serviceName,
          request.params.pluginId,
          request.body.config.allow,
        );

        if (serviceStore)
          response.json({ status: 'ok', plugins: serviceStore });
        response.json({ status: 'ok', services: [] });
      } catch (error: any) {
        let date = new Date();
        console.log(error);
        response.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.message,
          timestamp: new Date(date).toISOString(),
        });
      }
    },
  );

  router.get(
    '/plugins/:serviceName',
    async (request, response) => {
      try {
        const services = await kongHandler.listPluginsService(
          await kongServiceBase.getUrl(),
          request.params.serviceName,
        );

          response.json({ status: 'ok', services: services });
    
      } catch (error: any) {
        console.log(error)
        let date = new Date();
        response.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
          timestamp: new Date(date).toISOString(),
        });
      }
    },
  );

  router.put('/plugin/:serviceName', async (request, response) => {
    try {
      const serviceStore = await kongHandler.applyPluginToService(
        await kongServiceBase.getUrl(),
        request.params.serviceName,
        request.query.pluginName as string,
      );
     response.json({ status: 'ok', plugins: serviceStore });    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.delete(
    '/plugins/:serviceName',
    async (request, response) => {
      try {
        const serviceStore = await kongHandler.deletePluginsService(
          await kongServiceBase.getUrl(),
          request.params.serviceName,
          request.query.pluginName as string,
        );
          response.json({ status: 'ok', services: serviceStore });
      } catch (error: any) {
        let date = new Date();
        response.status(error.response.status).json({
          status: 'ERROR',
          message: error.response.data.errorSummary,
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
        .status(error.response.status)//verify
        .json({
          status: 'ERROR',
          message: error.response.data.errorSummary,//verify
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
  router.post('/credentials/:idApplication', async (req, res) => {
    try {
      const id = req.params.idApplication;
      const serviceStore = await kongHandler.generateCredential(
        options,
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

  router.get('/credentials/:idApplication', async (req, res) => {
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