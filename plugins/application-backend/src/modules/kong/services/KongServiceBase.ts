import { PlatformConfig } from '../../utils/PlatformConfig';

export class KongServiceBase {

 

   constructor() {

  }

  /**
   * Get the base url for the Kong Admin API, including the workspace
   * @returns {string} - url + workspace
   */
  public async getBaseUrl(): Promise<string> {
    const config = await PlatformConfig.Instance.getConfig();
    const url = config.getString('kong.api-manager');
    const workspace = 'default';
    return `${url}/${workspace}`;
  }


  /**
   * Get the url for the Kong Admin API
   */
  public async getUrl(): Promise<string> {
    const config = await PlatformConfig.Instance.getConfig();
    return config.getString('kong.api-manager');
  }

  /**
   * Get the Kong Admin Token
   */
  public async getToken(): Promise<string> {
    const config = await PlatformConfig.Instance.getConfig();
    return config.getString('kong.admin-token');
  }

  /**
   * Get the Kong workspace selected, default workspace is 'default'
   */
  public async getWorkspace(): Promise<string> {
    const config = await PlatformConfig.Instance.getConfig();
    return config.getOptionalString('kong.workspace') ?? 'default';
  }

  /**
   * Get the Kong Auth Header selected
   */
  public async getAuthHeader(): Promise<
    | {
        
      [key:string]: string;
      }
  > {
    const config = await PlatformConfig.Instance.getConfig();
    const token = config.getString('kong.admin-token');
    return token ? { 'Kong-Admin-Token': token } : {};
  }
}
