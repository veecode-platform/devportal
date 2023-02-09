import axios from 'axios';
import { KongServiceBase } from './KongServiceBase';

export enum PluginName {
  acl = 'acl',
  key_auth = 'key-auth',
  rate_limiting = 'rate-limiting',
  oauth2 = 'oauth2'
}

export class PluginService extends KongServiceBase {
  [x: string]: any;
  public async applyPluginKongService(
    serviceName: string,
    pluginName: PluginName,
    config: Map<string, any>,
  ) {
    try{
      const url = `${await this.getUrl()}/services/${serviceName}/plugins`;
      const response = await axios.post(url, {
        service: serviceName,
        name: pluginName,
        config:  Object.fromEntries(config)
      });
      return response.data;
    }catch(error){
      console.log(error)
      return error
    }

  }

  public async updatePluginKongService(
    serviceName: string,
    pluginId: string,
    config: Map<string, string>,
  ) {
    const url = `${await this.getUrl()}/services/${serviceName}/plugins/${pluginId}`;
    const response = await axios.patch(url, {
      config: Object.fromEntries(config),
    });

    return response.data;
  }

  public async listPluginsKongService(serviceName: string) {
    const url = `${await this.getUrl()}/services/${serviceName}/plugins`;
    const response = await axios.get(url);
    return response.data;
  }

  public async removePluginKongService(serviceName: string, pluginId: string) {
    const url = `${await this.getUrl()}/services/${serviceName}/plugins/${pluginId}`;
    console.log(url)
    const response = await axios.delete(url);
    console.log(response)
    return response.data;
  }
}

