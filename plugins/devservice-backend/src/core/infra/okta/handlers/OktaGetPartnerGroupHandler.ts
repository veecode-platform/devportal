import axios from 'axios';
import { OktaConfig } from "../../providers/types";

export class OktaGetPartnerGroupHandler {
  async handle(oktaConfig:OktaConfig,oktaHeaderConfig:any): Promise<string> {
    const partnerQueryUrl = `https://${oktaConfig.oktaDomainUrl}/api/v1/groups?q=profile.name eq "devportal_partners"`;
    const partnerGroupId = await (await axios.get(partnerQueryUrl,oktaHeaderConfig))
    return partnerGroupId.data.id ? partnerGroupId.data.id : '';
  }
}

