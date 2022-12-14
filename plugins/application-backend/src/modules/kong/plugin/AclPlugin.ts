// import { PluginService } from "../services/PluginService";

import { PluginName, PluginService } from "../services/PluginService";

export class AclPlugin extends PluginService{


    public async configAclKongService(serviceName: string, allowedList: string[]){
        let map: Map<string, string> = new Map<string, string>();
        map.set("config.hide_groups_header", "true")
        map.set("allow", 'teste')
        const testeMap = map;
         testeMap;
        this.applyPluginKongService(serviceName, PluginName.ACL, map)
    }


}