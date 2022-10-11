// class with handle method to get list from okta api using axios
import axios from 'axios'
import {IListUsersProvider } from '../../providers/models/IListUsersProvider';


export type ResponseData = {
users:any[],
errorCode?:string,
}
export class OktaListUsersHandler implements IListUsersProvider {
  
  async handle(oktaDomainUrl: string, token: string): Promise<void> {
      const result= await axios.get(oktaDomainUrl, {
          headers: {
          Authorization: `SSWS ${token}`,
          },
        })
      console.log(result.data);
  }
}


