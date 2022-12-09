import { Config } from '@backstage/config';

export class KongServiceBase {
  url: string;
  adminToken: string;
  workspace: string;

  constructor(private _config: Config) {
    this.url = _config.getString('kong.api-manager');
    this.workspace = this._config.getOptionalString('kong.workspace')??'default';
    this.adminToken = this._config.getString('kong.admin-token');
  }
}

