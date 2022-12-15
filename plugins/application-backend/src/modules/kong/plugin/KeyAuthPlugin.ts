import { Config } from '@backstage/config';
import { PluginName, PluginService } from '../services/PluginService';

export class KeyAuthPlugin extends PluginService {
//   private static _instance: KeyAuthPlugin;
//   private static _config: Config;

//   private constructor(_config: Config) {
//     super(_config);
//   }

  public async configKeyAuthKongService(
    serviceName: string,
    keyNamesList: Array<string>,
  ) {
    let map: Map<string, any> = new Map<string, any>();
    map.set('key_names', keyNamesList);

    return this.applyPluginKongService(serviceName, PluginName.KEYAUTH, map);
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

//   public static get Instance() {
//     return this._instance || (this._instance = new this(this._config));
//   }
}
