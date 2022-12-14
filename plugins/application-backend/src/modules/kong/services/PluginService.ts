import axios from 'axios';
import { KongServiceBase } from './KongServiceBase';

export class PluginService extends KongServiceBase {
  public async applyPluginKongService(
    serviceName: string,
    pluginName: PluginName,
    config?: Map<string, string>,
  ) {


    const teste = {service: serviceName, name: pluginName,  config: config}

    const url = `${this.baseUrl}/services/${serviceName}/plugins`;
    console.log('AQUI ESTÀ O MAP ->', teste)
    const response = await axios.post(url, {
      service: serviceName,
      name: pluginName,
      config: config
    });
    return response;
  }

  public async updatePluginKongService(
    serviceName: string,
    pluginName: string,
    config?: Map<string, string>,
  ) {
    const url = `${this.baseUrl}/services/${serviceName}/plugins`;
    const response = await axios.post(url, {
      service: serviceName,
      name: pluginName,
      config: config,
    });
    return response;
  }

  public async findAllPluginKongService(
    serviceName: string,
  ) {
    const url = `${this.baseUrl}/services/${serviceName}/plugins`;
    const response = await axios.get(url);
    return response;
  }
}
export enum PluginName {
  ACL = 'acl',
  OAUTH = ''
}
