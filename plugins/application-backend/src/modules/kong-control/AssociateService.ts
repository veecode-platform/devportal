import { PluginDatabaseManager } from "@backstage/backend-common";
import { Config } from "@backstage/config";
import { Logger } from "winston";
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
        for (let index = 0; index < consumerName.length; index++) {
          application.consumerName.push(consumerName[index])
        }
      }else{
        application.consumerName = consumerName;
      }
      await applicationRepository.patchApplication(id, application as any);
  }

  async removeAssociate(routerOptions: RouterOptions, id: string, consumerName: string){
    const applicationRepository = await PostgresApplicationRepository.create(
      await routerOptions.database.getClient(),    
    );
    const application = await applicationRepository.getApplicationById(id)
      let posicao;
      for (let index = 0; index < application.consumerName.length; index++) {
        if(application.consumerName[index] == consumerName){
           application.consumerName.splice(index, 1)
          break
        }
      }
      await applicationRepository.patchApplication(id, application as any);
  }
async findAllAssociate(routerOptions: RouterOptions, id: string){
  const applicationRepository = await PostgresApplicationRepository.create(
    await routerOptions.database.getClient(),    
  );
    const associates = await applicationRepository.getApplicationById(id);
    return associates.consumerName
}
}
