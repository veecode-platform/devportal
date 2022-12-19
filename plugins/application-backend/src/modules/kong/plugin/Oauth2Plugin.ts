import { PluginName, PluginService } from "../services/PluginService";

export class Oauth2Plugin  extends PluginService {

    public async configureOauth(serviceName: string, authHeaderName: string,authorizationCode: boolean, implictGrant: boolean, clienteCredential: boolean, passwordGrant: boolean){
        let map: Map<string, any> = new Map<string, any>();
        map.set("auth_header_name", authHeaderName)
        map.set("enable_authorization_code", authorizationCode)
        map.set('enable_implicit_grant', implictGrant)
        map.set('enable_client_credentials', clienteCredential)
        map.set('enable_password_grant', passwordGrant)
        return this.applyPluginKongService(serviceName, PluginName.OAUTH2, map); 
    }


    public async updateOauth(serviceName: string, authHeaderName: string,authorizationCode: boolean, implictGrant: boolean, clienteCredential: boolean, passwordGrant: boolean){
        let map: Map<string, any> = new Map<string, any>();
        map.set("auth_header_name", authHeaderName)
        map.set("enable_authorization_code", authorizationCode)
        map.set('enable_implicit_grant', implictGrant)
        map.set('enable_client_credentials', clienteCredential)
        map.set('enable_password_grant', passwordGrant)
        return this.updatePluginKongService(serviceName, PluginName.OAUTH2, map); 
    }

    public async removeOauth(serviceId: string, pluginId: string){
        return this.removePluginKongService(serviceId, pluginId);
    }
 
}