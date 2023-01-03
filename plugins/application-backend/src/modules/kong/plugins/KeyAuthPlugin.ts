import { PluginName, PluginService } from '../services/PluginService';

export class KeyAuthPlugin extends PluginService {
  private static _instance: KeyAuthPlugin;



  public async configKeyAuthKongService(
    serviceName: string,
    keyNamesList?: Array<string>,
  ) {
    let map: Map<string, any> = new Map<string, any>();
    map.set('key_names', keyNamesList);

    return this.applyPluginKongService(serviceName, PluginName.key_auth, map);
    // instanciar plugin a partir daqui e salvar no banco. 
  }

  public async updateKeyAuthKongService(
    serviceName: string,
    pluginId: string,
    keyNamesList: Array<string>,
  ) {
    let map: Map<string, any> = new Map<string, any>();
    map.set('key_names', keyNamesList);

    return this.updatePluginKongService(serviceName, pluginId, map);
  }

  public async removeKeyAuthKongService(serviceName: string, pluginId: string) {
    this.removePluginKongService(serviceName, pluginId);
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
  
}
