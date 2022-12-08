import axios from "axios";
export class PluginService{

    public async configAclPluginKongService(kongUrl: string,serviceName: string, allowed: string[], hidegroupsheader: boolean){
        const url = `http://${kongUrl}/services/${serviceName}/plugins`
         const response = await axios.post(url, {
            enabled: true,
            name: 'acl',
            config: {
                allow: allowed,
                hide_groups_header: hidegroupsheader
            }
        })
        return response.data;
    }
}