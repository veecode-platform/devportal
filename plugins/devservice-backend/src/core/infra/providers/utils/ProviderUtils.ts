import {OktaConfig} from '../types';

export async function makeOktaConfig(provider:any): Promise<OktaConfig> {
  const oktaConfig: OktaConfig = {
    oktaDomainUrl: provider.okta?.development?.audience,
    token: provider.okta?.development?.apiToken,
  };
  return oktaConfig;
}
