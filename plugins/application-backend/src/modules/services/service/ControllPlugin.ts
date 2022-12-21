
import { KeyAuthPlugin } from "../../kong/plugins/KeyAuthPlugin";
import { Oauth2Plugin } from "../../kong/plugins/Oauth2Plugin";
import { SECURITY } from "../domain/Service";
import { ServiceDto } from "../dtos/ServiceDto";
export class ControllPlugin{

    public async applyOuath(service: ServiceDto){
        try{
            console.log(service.securityType.toString())
            if(service.securityType.toString() == SECURITY.OAUTH2.toString()){
                console.log('TESTE')
                await Oauth2Plugin.instance().configureOauth(service.kongServiceName)
            }else if(service.securityType.toString() == SECURITY.KEY_AUTH.toString()){
                await  KeyAuthPlugin.Instance.configKeyAuthKongService(service.kongServiceName)
            }
        }catch(error){
            console.log(error)
        }
  
    }

}