import { IInviteProvider } from "../../providers/models/IInviteProvider";
import { makeOktaConfig } from "../../providers/utils/ProviderUtils";
import axios from 'axios'
import { InviteUserDto } from "../dtos/InviteUserDto";
import { makeOktaGetPartnerGroupHandler } from "../factories/makeOktaGetPartnerGroupHandler";

export class OktaInviteUserHandler implements IInviteProvider{

  async invite(invitedUser: InviteUserDto, providerConfig:any): Promise<void> {
    const oktaConfig = await makeOktaConfig(providerConfig)  
    const oktaHeaderConfig = {
      headers: {
        Authorization: `SSWS ${oktaConfig.token}`,
        }
    }
    const inviteUserUrl = `https://${oktaConfig.oktaDomainUrl}/api/v1/users?activate=true`;
    const partnerResult = makeOktaGetPartnerGroupHandler()
    const partnerGroupId = await partnerResult.handle(oktaConfig,oktaHeaderConfig);
    const partnerInvited :InviteUserDto = {
      profile:{
      firstName:invitedUser.profile.firstName,
      lastName:invitedUser.profile.lastName,
      email:invitedUser.profile.email},
      groupIds:[partnerGroupId]
    }
    const result =await axios.post(inviteUserUrl,partnerInvited,oktaHeaderConfig)
    }
}