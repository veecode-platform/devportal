import { PluginName, PluginService } from '../services/PluginService';

export class AclPlugin extends PluginService {
  public async configAclKongService(
    serviceName: string,
    allowedList: Array<string>,
  ) {
    let map: Map<string, any> = new Map<string, any>();
    map.set('hide_groups_header', true);
    map.set('allow', allowedList);

    return this.applyPluginKongService(serviceName, PluginName.ACL, map);
  }
}
