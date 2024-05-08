import { createApiRef, ConfigApi } from '@backstage/core-plugin-api';

const LICENSE_KEY_API_URL = "https://oyegfe9i74.execute-api.us-east-1.amazonaws.com/v1/licenses"


export interface LicenseKeyApi {
    validateLicenseKey(): Promise<any>;
}

export const licenseKeyApiRef = createApiRef<LicenseKeyApi>({
    id: 'plugin.support',
});

export type Options = {
    configApi: ConfigApi;
};

class Client {
    private readonly configApi: ConfigApi;


    constructor(opts: Options) {
        this.configApi = opts.configApi;

    }

    async validateLicenseKey() {
        const licenseKey =  this.configApi.getOptionalString("platform.support.licenseKey") || '';
        const resp = await fetch(`${LICENSE_KEY_API_URL}/${licenseKey}`)
        return await resp.json()
    }
 
}

export class LicenseKeyApiClient implements LicenseKeyApi {

    private readonly client: Client;

    constructor(opts: Options) {
        this.client = new Client(opts);
    }

    async validateLicenseKey(): Promise<any> {
        return await this.client.validateLicenseKey()
    }

}