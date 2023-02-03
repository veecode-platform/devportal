import { Router } from "express";
import { RouterOptions } from "./router";
import { KongHandler } from "../modules/kong-control/KongHandler";
import { KongServiceBase } from "../modules/kong/services/KongServiceBase";
import { AclPlugin } from "../modules/kong/plugins/AclPlugin";
import { ConsumerService } from "../modules/kong/services/ConsumerService";
import { Consumer } from "../modules/applications/dtos/ApplicationDto";
import { ConsumerGroupService } from "../modules/kong/services/ConsumerGroupService";
import { ConsumerGroup } from "../modules/kong/model/ConsumerGroup";
const aclPlugin = AclPlugin.Instance;

/** @public */
export async function createKongRouter(
  options: RouterOptions,
): Promise<Router> {

  const router = Router()
  const kongHandler = new KongHandler()
  const consumerService = new ConsumerService();
  const kongServiceBase = new KongServiceBase()
  const consumerGroupService = new ConsumerGroupService();


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
        if (error == undefined) {
          response.status(500).json({ status: 'error' })
        }
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
        if (error == undefined) {
          response.status(500).json({ status: 'error' })
        }
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
        response.json({ status: 'ok', services: services })
      } catch (error: any) {
        if (error == undefined) {
          response.status(500).json({ status: 'error' })
        }
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
      response.json({ status: 'ok', plugins: serviceStore });
    } catch (error: any) {
      if (error == undefined) {
        response.status(500).json({ status: 'error' })
      }
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
        if (error == undefined) {
          response.status(500).json({ status: 'error' })
        }
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
      if (error == undefined) {
        res.status(500).json({ status: 'error' })
      }
      let date = new Date();
      res
        .status(error.response.status) // verify
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
      if (error == undefined) {
        res.status(500).json({ status: 'error' })
      }
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


 

  // CONSUMER
  router.get('/consumers/:consumerName', async (request, response) => {
    try {
      const consumer = await consumerService.findConsumer(
        request.params.consumerName,
      );
      response.status(200).json({ status: 'ok', consumer: { consumer } });
    } catch (error: any) {
      response.status(error.status).json({
        message: error.message,
        timestamp: error.timestamp,
      });
    }
  });

  router.get('/consumers', async (_, res) => {
    try {
      const serviceStore = await kongHandler.listConsumers(await kongServiceBase.getUrl());
      if (serviceStore)
        res.status(200).json({ status: 'ok', costumer: serviceStore });

    } catch (error: any) {
      if (error == undefined) {
        res.status(500).json({ status: 'error' })
      }
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

  router.delete('/consumer/:id', async (request, response) => {
    try {
      const consumer = await consumerService.deleteConsumer(request.params.id);
      response.status(204).json({ status: 'ok', associates: { consumer } });
    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.put('/consumer/:id', async (request, response) => {
    try {
      const consumer: Consumer = request.body;
      const result = await consumerService.updateConsumer(
        request.params.id,
        consumer,
      );
      response.status(200).json({ status: 'ok', service: result });
    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });
  // CONSUMER GROUPS
  router.post('/consumer_groups', async (request, response) => {
    try {
      const consumerGroup: ConsumerGroup = request.body;
      const result = await consumerGroupService.createConsumerGroup(
        consumerGroup,
      );
      response.status(201).json({ status: 'ok', service: result });
    } catch (error: any) {
      console.log(error);
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.get('/consumer_groups', async (_, response) => {
    try {
      const consumerGroups = await consumerGroupService.listConsumerGroups();
      response.status(200).json({ status: 'ok', groups: { consumerGroups } });
    } catch (error: any) {
      response.status(error.status).json({
        message: error.message,
        timestamp: error.timestamp,
      });
    }
  });

  router.post('/consumer_groups', async (request, response) => {
    try {
      const consumerGroup: ConsumerGroup = request.body;
      const result = await consumerGroupService.createConsumerGroup(
        consumerGroup,
      );
      response.status(201).json({ status: 'ok', service: result });
    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.post('/consumer_groups/:id/consumers', async (request, response) => {
    try {
      const consumerGroup = request.body;
      const result = await consumerGroupService.addConsumerToGroup(
        request.params.id,
        consumerGroup,
      );
      response.status(201).json({ status: 'ok', service: result });
    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.delete('/consumer_groups/:id', async (request, response) => {
    try {
      const consumerGroup = await consumerGroupService.deleteConsumerGroup(
        request.params.id,
      );
      response.status(204).json({ status: 'ok', group: { consumerGroup } });
    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });

  router.delete(
    '/consumers/:consumerId/consumer_groups/:groupId',
    async (request, response) => {
      try {
        const consumerGroup =
          await consumerGroupService.removeConsumerFromGroup(
            request.params.consumerId,
            request.params.groupId,
          );
        response.status(204).json({ status: 'ok', group: { consumerGroup } });
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
  router.delete('/consumers/:id/consumer_groups', async (request, response) => {
    try {
      const consumerGroup = await consumerGroupService.removeConsumerFromGroups(
        request.params.id,
      );
      response.status(204).json({ status: 'ok', group: { consumerGroup } });
    } catch (error: any) {
      let date = new Date();
      response.status(error.response.status).json({
        status: 'ERROR',
        message: error.response.data.errorSummary,
        timestamp: new Date(date).toISOString(),
      });
    }
  });



  return router;
}