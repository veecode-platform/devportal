import { Config } from '@backstage/config';

export class KongConsumerBase {
  _kongUrl: string;
  _kongAdminToken: string;

  constructor(private _config: Config) {
    this._kongUrl = _config.getString('kong.api-manager');
    this._kongAdminToken = this._config.getString('kong.admin-token');
  }
}
