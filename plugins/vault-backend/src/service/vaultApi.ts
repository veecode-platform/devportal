/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Config } from '@backstage/config';
import { NotAllowedError, NotFoundError } from '@backstage/errors';
import fetch from 'node-fetch';
import plimit from 'p-limit';
import {
  getVaultConfig,
  VaultConfig,
  VaultKubernetesAuthConfig,
} from '../config';
import { readFile } from 'fs/promises';
import { VaultSecret } from '@backstage-community/plugin-vault-node';

/**
 * Object received as a response from the Vault API when fetching secrets
 * @internal
 *
 */
export type VaultSecretList = { [key: string]: string };

export interface ResultV1 {
  request_id: string;
  lease_id: string;
  renewable: boolean;
  lease_duration: number;
  data: VaultSecretList;
  wrap_info: null | unknown;
  warnings: null | unknown;
  auth: null | unknown;
  mount_type: string;
}

export interface ResultV2 {
  request_id: string;
  lease_id: string;
  renewable: boolean;
  lease_duration: number;
  data: {
    data: VaultSecretList[];
  };
  mount_type: string;
}

export type VaultSecretResult = ResultV1 | ResultV2;

/**
 * Object received as response when the token is renewed using the Vault API
 */
type RenewTokenResponse = {
  auth: {
    client_token: string;
  };
};

/**
 * Interface for the Vault API
 * @public
 * @deprecated Use the interface from `@backstage-community/plugin-vault-node`
 */
export interface VaultApi {
  /**
   * Returns the URL to access the Vault UI with the defined config.
   */
  getFrontendSecretsUrl(): string;

  /**
   * Returns a list of secrets used to show in a table.
   * @param secretPath - The path where the secrets are stored in Vault
   * @param options - Additional options to be passed to the Vault API, allows to override vault default settings in app config file
   */
  listSecrets(
    secretPath: string,
    options?: {
      secretEngine?: string;
    },
  ): Promise<VaultSecret[]>;

  /**
   * Optional, to renew the token used to list the secrets. Throws an
   * error if the token renewal went wrong.
   */
  renewToken?(): Promise<void>;
}

/**
 * Implementation of the Vault API to list secrets and renew the token if necessary
 * @public
 */
export class VaultClient implements VaultApi {
  private vaultConfig: VaultConfig;
  private readonly limit = plimit(5);

  constructor(options: { config: Config }) {
    this.vaultConfig = getVaultConfig(options.config);
  }

  private async kubernetesLogin(
    baseUrl: string,
    kubernetesCfg: VaultKubernetesAuthConfig,
  ): Promise<string> {
    const jwt = await readFile(kubernetesCfg.serviceAccountTokenPath, 'utf-8');

    const resp = await fetch(
      `${baseUrl}/v1/auth/${kubernetesCfg.authPath}/login`,
      {
        method: 'POST',
        body: JSON.stringify({
          role: kubernetesCfg.role,
          jwt: jwt,
        }),
      },
    );

    if (!resp.ok) {
      throw Error(
        `Error while login to vault. ${resp.status}: ${resp.statusText}`,
      );
    }

    const result: { auth: { client_token: string } } = await resp.json();
    return result.auth.client_token;
  }

  private async loadToken(): Promise<string> {
    switch (this.vaultConfig.token.type) {
      case 'static':
        return this.vaultConfig.token.config.secret;
      case 'kubernetes':
        return await this.kubernetesLogin(
          this.vaultConfig.baseUrl,
          this.vaultConfig.token.config,
        );
      default:
        throw new Error('Unknown token type');
    }
  }

  private async callApi<T>(path: string, method: string = 'GET'): Promise<T> {
    const token = await this.loadToken();
    const url = new URL(path, this.vaultConfig.baseUrl);
    const fetchUrl = `${url.toString()}`;

    const response = await fetch(fetchUrl, {
      method,
      headers: {
        Accept: 'application/json',
        'X-Vault-Token': token,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data as T;
    } else if (response.status === 404) {
      throw new NotFoundError(`No secrets found in path '${path}'`);
    } else if (response.status === 403) {
      throw new NotAllowedError(response.statusText);
    }
    throw new Error(
      `Unexpected error while fetching secrets from path '${path}'`,
    );
  }

  getFrontendSecretsUrl(): string {
    return `${this.vaultConfig.baseUrl}/ui/vault/secrets/${this.vaultConfig.secretEngine}`;
  }

  async listSecrets(
    secretPath: string,
    options?: {
      secretEngine?: string;
    },
  ): Promise<VaultSecret[]> {
    const mount = options?.secretEngine || this.vaultConfig.secretEngine;
    const vaultUrl = this.vaultConfig.publicUrl || this.vaultConfig.baseUrl;
    const listUrl =
      this.vaultConfig.kvVersion === 2
        ? `v1/${encodeURIComponent(mount)}/data/${secretPath}`
        : `v1/${encodeURIComponent(mount)}/${secretPath}`;

    const result = await this.limit(() =>
      this.callApi<VaultSecretResult>(listUrl),
    );

    const secretlistFromResult =
      this.vaultConfig.kvVersion === 2 ? result.data.data : result.data;

    const secrets: VaultSecret[] = [];

    await Promise.all(
      Object.keys(secretlistFromResult).map(key => {
        secrets.push({
          name: key,
          path: secretPath,
          editUrl: `${vaultUrl}/ui/vault/secrets/${encodeURIComponent(
            mount,
          )}/edit/${secretPath}`,
          showUrl: `${vaultUrl}/ui/vault/secrets/${encodeURIComponent(
            mount,
          )}/show/${secretPath}`,
        });
      }),
    );

    return secrets;
  }

  async renewToken(): Promise<void> {
    if (this.vaultConfig.token.type === 'kubernetes') {
      return;
    }
    const result = await this.callApi<RenewTokenResponse>(
      'v1/auth/token/renew-self',
      'POST',
    );

    this.vaultConfig.token.config.secret = result.auth.client_token;
  }
}
