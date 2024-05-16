import { createApiRef, ConfigApi } from '@backstage/core-plugin-api';

const LICENSE_KEY_API_URL = "https://api.platform.vee.codes/license-key/v1/licenses"

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
        const licenseKey = this.configApi.getOptionalString("platform.support.licenseKey");

        if (!licenseKey) return await new Response(JSON.stringify({
            valid_key: false,
            message: "Key not found!"
        })).json()

        const resp = await fetch(`${LICENSE_KEY_API_URL}/${licenseKey}`, {
            headers: {
                "X-api-key": "018f779d-6ee2-790e-8f2d-ac16204d9609"
            }
        })
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