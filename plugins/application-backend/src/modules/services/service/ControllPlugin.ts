
import { Consumer } from "../../kong/model/Consumer";
import { ConsumerGroup } from "../../kong/model/ConsumerGroup";
import { AclPlugin } from "../../kong/plugins/AclPlugin";
import { KeyAuthPlugin } from "../../kong/plugins/KeyAuthPlugin";
import { Oauth2Plugin } from "../../kong/plugins/Oauth2Plugin";
import { ConsumerGroupService } from "../../kong/services/ConsumerGroupService";
import { SECURITY } from "../domain/Service";
import { ServiceDto } from "../dtos/ServiceDto";
export class ControllPlugin{

    public async applySecurityType(service: ServiceDto){
        const consumerGroupService = new ConsumerGroupService();
        try{
            if(service.securityType.toString() == SECURITY.OAUTH2.toString()){
                await Oauth2Plugin.instance().configureOauth(service.kongServiceName)
                const consumerGroup: ConsumerGroup = new ConsumerGroup(service.kongServiceName + 'group')
                await consumerGroupService.createConsumerGroup(consumerGroup);
                await AclPlugin.Instance.configAclKongService(service.kongServiceName, [`${service.kongServiceName + '-group'}`])
            }else if(service.securityType.toString() == SECURITY.KEY_AUTH.toString()){
                await  KeyAuthPlugin.Instance.configKeyAuthKongService(service.kongServiceName)
                const consumerGroup: ConsumerGroup = new ConsumerGroup(service.kongServiceName + 'group')
                await consumerGroupService.createConsumerGroup(consumerGroup);
                await AclPlugin.Instance.configAclKongService(service.kongServiceName, [`${service.kongServiceName + '-group'}`])
            }
        }catch(error){
            console.log(error)
        }
  
    }

}