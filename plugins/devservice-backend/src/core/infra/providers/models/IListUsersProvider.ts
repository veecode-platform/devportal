export interface IListUsersProvider {
  handle(providerDomainUrl: string, token: string): Promise<void>;
}
