import axios from "axios";
import { KongServiceBase } from "./KongServiceBase";

export class PluginService extends KongServiceBase{

    public async applyPluginKongService(serviceName: string, pluginName: string, config?:Map<string, string>){
        const url = `${this.baseUrl}/services/${serviceName}/plugins`;
        console.log(url)
        const response = await axios.post(url, {
            service: serviceName,
            name: pluginName,
            config
        })
        console.log(config)
        return response; 
    }

}