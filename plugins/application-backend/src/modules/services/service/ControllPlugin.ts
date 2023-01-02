
import { Consumer } from "../../kong/model/Consumer";
import { ConsumerGroup } from "../../kong/model/ConsumerGroup";
import { KeyAuthPlugin } from "../../kong/plugins/KeyAuthPlugin";
import { Oauth2Plugin } from "../../kong/plugins/Oauth2Plugin";
import { ConsumerGroupService } from "../../kong/services/ConsumerGroupService";
import { SECURITY } from "../domain/Service";
import { ServiceDto } from "../dtos/ServiceDto";
export class ControllPlugin{

    public async applyOuath(service: ServiceDto){
        const consumerGroupService = new ConsumerGroupService();
        try{
            console.log(service.securityType.toString())
            if(service.securityType.toString() == SECURITY.OAUTH2.toString()){
                await Oauth2Plugin.instance().configureOauth(service.kongServiceName)
                const consumerGroup: ConsumerGroup = new ConsumerGroup(service.kongServiceName + 'group', service.kongServiceName + 'tags')
                consumerGroupService.createConsumerGroup(consumerGroup);
            }else if(service.securityType.toString() == SECURITY.KEY_AUTH.toString()){
                await  KeyAuthPlugin.Instance.configKeyAuthKongService(service.kongServiceName)
                const consumerGroup: ConsumerGroup = new ConsumerGroup(service.kongServiceName + 'group', service.kongServiceName + 'tags')
                consumerGroupService.createConsumerGroup(consumerGroup);
            }
        }catch(error){
            console.log(error)
        }
  
    }

}