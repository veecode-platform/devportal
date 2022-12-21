import { AclPlugin } from "../../kong/plugins/AclPlugin";
import { PlatformConfig } from "../../utils/PlataformConfig";

export class ControllPlugin{

    public async aplyAcl(){
        const config = await PlatformConfig.Instance.getConfig();
        const aclPlugin = AclPlugin.instance(config);
    }

}