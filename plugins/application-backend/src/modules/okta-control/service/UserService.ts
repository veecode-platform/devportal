import axios from "axios";
import { UserInvite } from "../model/UserInvite";
import { User } from "../model/User";




export class UserService{

    public async listUser(urlOkta: string, token:string, busca:string): Promise<User[]>{
        const url = `https://${urlOkta}/api/v1/users?q=${busca}`;
        
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
        users.filter((objt) => {
            objt.credentials = undefined
            objt._links = undefined
        })
        return (users as User[])
    }


    public async listUserByGroup(urlOkta: string, groupId: string, token:string, status:string): Promise<User[]> {
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
        return (result as User[]);
    }


    public async inviteUserByEmail(urlOkta: string, token:string, user:UserInvite ){
        const url = `https://${urlOkta}/api/v1/users?activate=true`;
        const response = await axios.post(url, {
            profile: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                login: user.login,    
                mobilePhone: user.mobilePhone
                }
          }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `SSWS ${token}`
            }
          })
        return response.data.profile;
    }
}