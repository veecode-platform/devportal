
import { PluginName, PluginService } from '../services/PluginService';
import axios from 'axios';
export class AclPlugin extends PluginService {
  private static _instance: AclPlugin;

  private constructor(_config: Config) {
    super(_config);
  }

  public async configAclKongService(
    serviceName: string,
    allowedList: Array<string>,
  ) {
    let map: Map<string, any> = new Map<string, any>();
    map.set('hide_groups_header', true);
    map.set('allow', allowedList);

    return this.applyPluginKongService(serviceName, PluginName.ACL, map);
  }

  public async updateAclKongService(
    serviceName: string,
    pluginId: string,
    allowedList: Array<string>,
  ) {
    const response = await axios.get(`${this.baseUrl}/services/${serviceName}/plugins/${pluginId}`);
    let array: String[] = response.data.config.allow;
    for (let index = 0; index < allowedList.length; index++) {
      array.push(allowedList[index]);
    }
    let map: Map<string, any> = new Map<string, any>();
    map.set('allow', array);
    return this.updatePluginKongService(serviceName, pluginId, map);
  }

  public async removeAclKongService(serviceName: string, pluginId: string) {
    this.removePluginKongService(serviceName, pluginId);
  }

  public static instance(config: Config) {
    return this._instance || (this._instance = new this(config));
  }
}
