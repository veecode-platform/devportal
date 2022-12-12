import axios from "axios";
export class PluginService{

    public async configAclKongService(kongUrl: string,serviceName: string, allowed: string[], hidegroupsheader: boolean){
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

    public async removeAclKongService(kongUrl: string, serviceName: string, idAcl: string){
        const url = `http://${kongUrl}/services/${serviceName}/plugins/${idAcl}`
        const response = await axios.delete(url)
        return response.data;
    }


}