import axios from 'axios'


export class OktaHandler{


    public async listUserByGroup(urlOkta: string, groupId: string, token:string){
        console.log('aqui1')
        const url = `https://${urlOkta}/api/v1/groups/${groupId}/users`;
        const response = await axios.get(url, {
            headers: {

                'Content-Type': 'application/json',
                'Authorization': `SSWS ${token}`
            }
        });
        console.log('aqui2')
        return response.data;
    
    }

}