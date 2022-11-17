import { ProviderUser } from "./ProviderUser";

export interface IListGroupUsersProvider {
  handle(providerDomainUrl: string, token: string): Promise<ProviderUser[]>;
}
