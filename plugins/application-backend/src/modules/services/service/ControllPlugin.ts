
import { PluginDatabaseManager } from "@backstage/backend-common";
import { Consumer } from "../../kong/model/Consumer";
import { ConsumerGroup } from "../../kong/model/ConsumerGroup";
import { AclPlugin } from "../../kong/plugins/AclPlugin";
import { KeyAuthPlugin } from "../../kong/plugins/KeyAuthPlugin";
import { Oauth2Plugin } from "../../kong/plugins/Oauth2Plugin";
import { ConsumerGroupService } from "../../kong/services/ConsumerGroupService";
import { SECURITY, Service } from "../domain/Service";
import { ServiceDto } from "../dtos/ServiceDto";
import { PostgresServiceRepository } from "../repositories/Knex/KnexServiceReppository";



/** @public */
export interface RouterOptions {
    database: PluginDatabaseManager;
  }
export class ControllPlugin{

    private aclPlugin = AclPlugin.Instance;

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

    public async remove(routerOptions: RouterOptions, serviceId: string){
        const ServiceRepository = await PostgresServiceRepository.create(
            await routerOptions.database.getClient(),    
          );

        const service: Service = await ServiceRepository.getServiceById(serviceId)
        service.props.securityType = SECURITY.NONE;
       // this.aclPlugin.removePluginKongService(service.props.kongServiceName, )
        ServiceRepository.patchService(service._id as string, service)
    }

}