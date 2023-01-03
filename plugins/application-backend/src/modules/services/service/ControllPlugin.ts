
import { PluginDatabaseManager } from "@backstage/backend-common";
import { ConsumerGroup } from "../../kong/model/ConsumerGroup";
import { AclPlugin } from "../../kong/plugins/AclPlugin";
import { KeyAuthPlugin } from "../../kong/plugins/KeyAuthPlugin";
import { Oauth2Plugin } from "../../kong/plugins/Oauth2Plugin";
import { ConsumerGroupService } from "../../kong/services/ConsumerGroupService";
import { SECURITY, Service } from "../domain/Service";
import { ServiceDto } from "../dtos/ServiceDto";
import { PostgresServiceRepository } from "../repositories/Knex/KnexServiceReppository";
import { PostgresPluginRepository } from "../../plugins/repositories/Knex/KnexPluginRepository";
import { Plugin } from "../../plugins/domain/Plugin";



/** @public */
export interface RouterOptions {
    database: PluginDatabaseManager;
  }
export class ControllPlugin{



    public async applySecurityType(service: ServiceDto){
        const consumerGroupService = new ConsumerGroupService();
        try{
            if(service.securityType.toString() == SECURITY.OAUTH2.toString()){
                await Oauth2Plugin.instance().configureOauth(service.kongServiceName)
                const consumerGroup: ConsumerGroup = new ConsumerGroup(service.kongServiceName + '-group')
                await consumerGroupService.createConsumerGroup(consumerGroup);
                await AclPlugin.Instance.configAclKongService(service.kongServiceName, [`${service.kongServiceName + '-group'}`])
            }else if(service.securityType.toString() == SECURITY.KEY_AUTH.toString()){
                await  KeyAuthPlugin.Instance.configKeyAuthKongService(service.kongServiceName)
                const consumerGroup: ConsumerGroup = new ConsumerGroup(service.kongServiceName + '-group')
                await consumerGroupService.createConsumerGroup(consumerGroup);
                await AclPlugin.Instance.configAclKongService(service.kongServiceName, [`${service.kongServiceName + '-group'}`])
            }
        }catch(error){
            console.log(error)
        }
  
    }

    public async removePlugin(routerOptions: RouterOptions, serviceId: string){
        const ServiceRepository = await PostgresServiceRepository.create(
            await routerOptions.database.getClient(),    
          );
          const PluginRepository = await PostgresPluginRepository.create(
            await routerOptions.database.getClient(),
          );

        let service = await ServiceRepository.getServiceById(serviceId)
        service = Object.values(service)[0];
  
        service.securityType = SECURITY.NONE;
        const kongServiceId = service.id;
        console.log('Kong service Id', kongServiceId)
        const plugin: Plugin = await PluginRepository.getPluginByServiceId(kongServiceId);
        await AclPlugin.Instance.removePluginKongService(service.kongServiceName, plugin.pluginId)
        // PluginRepository.deletePlugin(plugin.id);
        ServiceRepository.updateService(serviceId, service)
    }


    public async changeToOauth2(routerOptions: RouterOptions, serviceId: string){
        const ServiceRepository = await PostgresServiceRepository.create(
            await routerOptions.database.getClient(),    
          );
          let service = await ServiceRepository.getServiceById(serviceId)
          service = Object.values(service)[0];

          service.securityType = SECURITY.OAUTH2;

          Oauth2Plugin.instance().configureOauth(service.KongServiceName);
          ServiceRepository.updateService(serviceId, service);
    }

    public async changeStatus(routerOptions: RouterOptions, serviceId: string, status: boolean){
        const ServiceRepository = await PostgresServiceRepository.create(
            await routerOptions.database.getClient(),    
          );
          let service = await ServiceRepository.getServiceById(serviceId)
          service = Object.values(service)[0];

          service.status = status;
          ServiceRepository.updateService(serviceId, service);
    }

}