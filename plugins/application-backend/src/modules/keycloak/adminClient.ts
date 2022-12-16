import KcAdminClient from '@keycloak/keycloak-admin-client';

export class KeycloakAdminClient {
  public async getClient(): Promise<KcAdminClient> {
    const kcAdminClient = new KcAdminClient({
      baseUrl: 'http://127.0.0.1:8080',
      realmName: 'master',
    });
    
    // Authorize with username / password
      await kcAdminClient.auth({
        username: 'admin',
        password: 'admin',
        grantType: 'password',
        clientId: 'admin-cli',
      });
      kcAdminClient.setConfig({
        realmName: 'platform-devportal',
      });
      return kcAdminClient
  }
}

export class TestGroups {
  public async getGroup(){
    const kcAdminClient = await new KeycloakAdminClient().getClient();
    const groups = await kcAdminClient.groups.find();
    return groups;
  }
}

