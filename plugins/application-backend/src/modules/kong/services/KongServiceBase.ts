import { Config } from '@backstage/config';

export class KongServiceBase {
  private _url: string;
  private _token: string;
  private _workspace: string;

  constructor(private _config: Config) {
    this._url = _config.getString('kong.api-manager');
    this._workspace =
      this._config.getOptionalString('kong.workspace') ?? 'default';
    this._token = this._config.getString('kong.admin-token');
  }

  /**
   * Get the url for the Kong Admin API
   */
  public get url(): string {
    return this._url;
  }

  /**
   * Get the Kong Admin Token
   */
  public get token(): string {
    return this._token;
  }

  /**
   * Get the Kong workspace selected, default workspace is 'default'
   */
  public get workspace(): string {
    return this._workspace;
  }

  /**
   * Get the base url for the Kong Admin API, including the workspace
   * @returns {string} - url + workspace
   */
  public get baseUrl(): string {
    return `${this._url}/${this._workspace}`;
  }

  public getAuthHeader(): { [key: string]: string } {
    return this._token ? { 'Kong-Admin-Token': this._token } : {};
  }
}
