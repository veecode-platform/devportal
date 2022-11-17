import axios from 'axios'
import { IListGroupUsersProvider } from '../../providers/models/IListGroupUsersProvider';
import { GroupUtils } from '../utils/GroupUtils';
import { OktaUser } from '../models/OktaUser';
import { makeOktaConfig } from '../../providers/utils/ProviderUtils';
import { OktaUserDto } from '../dtos/OktaUserDto';

export type ResponseData = {
users:any[],
errorCode?:string,
}
export class OktaListGroupUsersHandler implements IListGroupUsersProvider {
  async handle(providerConfig: any): Promise<OktaUser[]> {
    
    const oktaConfig = await makeOktaConfig(providerConfig)  
    const oktaHeaderConfig = {
      headers: {
        Authorization: `SSWS ${oktaConfig.token}`,
        }
    }
    const oktaApiUrlGroups=`${oktaConfig.oktaDomainUrl}/api/v1/groups`;
    const oktaGroups = await axios.get(oktaApiUrlGroups,oktaHeaderConfig)
    
    const partnerGroupId =  await GroupUtils.extractIdByGroupName(oktaGroups.data);
    const groupUsersUrl=`${oktaConfig.oktaDomainUrl}/api/v1/groups/${partnerGroupId}/users`;
    const result = await axios.get(groupUsersUrl,oktaHeaderConfig)

    const partners =await result.data.map((user:OktaUserDto) => {
      const oktaId= user.id;
      const {profile:{firstName,lastName,email}} = user;
      return {oktaId,firstName,lastName,email};
      }
    )
     return  partners ? partners : [];
  }
}


