import { InviteUserDto } from "../../okta/dtos/InviteUserDto";

export interface IInviteProvider {
  invite(invitedUser: InviteUserDto, partnerGroupId: string, providerConfig:any): Promise<void>;
}  
