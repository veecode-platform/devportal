import { PluginDatabaseManager } from "@backstage/backend-common";
import { Config } from "@backstage/config";
import { application } from "express";
import { Logger } from "winston";
import { ApplicationResponseDto } from "../applications/dtos/ApplicationResponseDto";
import { PostgresApplicationRepository } from "../applications/repositories/knex/KnexApplicationRepository";


/** @public */
export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
}

export class AssociateService{


  async associate(routerOptions: RouterOptions, id: string, consumerName: string[] ) {
    const applicationRepository = await PostgresApplicationRepository.create(
      await routerOptions.database.getClient(),

    
    );
       const application = await applicationRepository.getApplicationById(id);
      const arrayConsumerName = application.consumerName
      if(arrayConsumerName != null){
        arrayConsumerName.push(consumerName);
        application.consumerName = arrayConsumerName;
      }else{
        application.consumerName = consumerName;
      }
      console.log('before update',application);
      await applicationRepository.patchApplication(id, application as any);
      console.log('aqui')
       



    
  }

  
}

// /** @public */
// async function createRouter(
//   options: RouterOptions,
// ): Promise<express.Router> {
//   const { logger, database} = options;

//   const applicationRepository = await PostgresApplicationRepository.create(
//     await database.getClient()
//   );
//   return Router();
// }