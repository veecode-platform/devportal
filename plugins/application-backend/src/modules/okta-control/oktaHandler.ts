import axios from 'axios'


type Users = {
    id: string;
    status: string;
    created: string;
    activated: string;
    statusChanged: string;
    lastLogin: string;
    lastUpdated: string;
    passwordChanged: string;
    type: Type;
    profile: Profile;
  }
  
  type Type = {
    id: string;
  }
  
  type Profile = {
    firstName: string;
    lastName: string;
    mobilePhone: string;
    secondEmail: string;
    login: string;
    email: string;
  }
  
export class OktaHandler{


 


    public async listUserByGroup(urlOkta: string, groupId: string, token:string, status:string): Promise<Users[]> {
        const url = `https://${urlOkta}/api/v1/groups/${groupId}/users`;
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `SSWS ${token}`
            }
        });
        const users = []
        for(let i = 0; i< response.data.length; i++){
            users.push(response.data[i]);
        }

        const result = users.filter((objt => {
            return objt.status === `${status}`
        }))
        result.filter((objt) => {
         objt.credentials = undefined
         objt._links = undefined;
    }
        )
        
        return result as Users[];
    
    }

}