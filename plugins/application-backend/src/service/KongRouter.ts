
import { Router } from "express";
import { KongHandler } from "../modules/kong-control/KongHandler";
import { KongServiceBase } from "../modules/kong/services/KongServiceBase";




    const kongServiceBase = new KongServiceBase();
    const KongRouter = Router();
    const kongHandler = new KongHandler();
    


    KongRouter.get(
        '/plugins/:serviceName',
        async (req, resp) => {
          try {
            const serviceStore = await kongHandler.listPluginsService(
              false,
              await kongServiceBase.getUrl(),
              req.params.serviceName,
            );
            console.log('aqui', serviceStore)
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

      KongRouter.get('/services', async (_, res) => {
        try{
          const serviceStore = await kongHandler.listServices(await kongServiceBase.getUrl(),false);
          if (serviceStore) 
          res.json({ status: 'ok', services: serviceStore });
        }catch(error: any){
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

      KongRouter.get('/consumers', async (_, res) => {
        try{
          const serviceStore = await kongHandler.listConsumers(await kongServiceBase.getUrl(),false);
          if (serviceStore) 
          res.status(200).json({ status: 'ok', costumer: serviceStore });
       
        }catch(error: any){
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
      KongRouter.post('/credential/:id', async (req, res) => {
        try {
          const workspace = req.query.workspace as string;
          const id = req.params.id;
          const serviceStore = await kongHandler.generateCredential(
            false,
            await kongServiceBase.getUrl(),
            workspace as string,
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
    
      KongRouter.get('/credential/:idConsumer', async (req, res) => {
        try {
          const workspace = req.query.workspace as string;
          const id = req.params.idConsumer;
          const serviceStore = await kongHandler.listCredential(
            false,
            await kongServiceBase.getUrl(),
            workspace,
            id,
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

export default KongRouter;