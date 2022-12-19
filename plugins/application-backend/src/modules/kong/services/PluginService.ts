import axios from 'axios';
import { KongServiceBase } from './KongServiceBase';

export class PluginService extends KongServiceBase {
  public async applyPluginKongService(
    serviceName: string,
    pluginName: PluginName,
    config: Map<string, any>,
  ) {
    const url = `${this.baseUrl}/services/${serviceName}/plugins`;

    const response = await axios.post(url, {
      service: serviceName,
      name: pluginName,
      config:  Object.fromEntries(config)
    });
    console.log('config: ');
    return response.data;
  }

  public async updatePluginKongService(
    serviceName: string,
    pluginId: string,
    config: Map<string, any>,
  ) {
    const url = `${this.baseUrl}/services/${serviceName}/plugins/${pluginId}`;
    const response = await axios.patch(url, {
      config: Object.fromEntries(config),
    });

    return response.data;
  }

  public async listPluginsKongService(serviceName: string) {
    const url = `${this.baseUrl}/services/${serviceName}/plugins`;
    const response = await axios.get(url);
    return response;
  }

  public async removePluginKongService(serviceName: string, pluginId: string) {
    const url = `${this.baseUrl}/services/${serviceName}/plugins/${pluginId}`;
    const response = await axios.delete(url);
    return response;
  }
}

export enum PluginName {
  ACL = 'acl',
  KEYAUTH = 'key-auth',
}
