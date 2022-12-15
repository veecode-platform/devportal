import { Config } from '@backstage/config';
import { PluginName, PluginService } from '../services/PluginService';

export class RateLimitingPlugin extends PluginService {
  private static _instance: RateLimitingPlugin;

  private constructor(_config: Config) {
    super(_config);
  }

  public async configRateLimitingKongService(
    serviceName: string,
    second: number,
    minute?: number,
    hour?: number,
    day?: number,
  ) {
    let map: Map<string, any> = new Map<string, any>();
    map.set('second', second);
    map.set('minute', minute);
    map.set('hour', hour);
    map.set('day', day);

    return this.applyPluginKongService(
      serviceName,
      PluginName.RATE_LIMITING,
      map,
    );
  }

  public async updateRateLimitingKongService(
    serviceName: string,
    pluginId: string,
    second: number,
    minute?: number,
    hour?: number,
    day?: number,
  ) {
    let map: Map<string, any> = new Map<string, any>();
    map.set('second', second);
    map.set('minute', minute);
    map.set('hour', hour);
    map.set('day', day);

    return this.updatePluginKongService(serviceName, pluginId, map);
  }

  public async removeRateLimitingKongService(
    serviceName: string,
    pluginId: string,
  ) {
    this.removePluginKongService(serviceName, pluginId);
  }

  public static instance(config: Config) {
    return this._instance || (this._instance = new this(config));
  }
}
