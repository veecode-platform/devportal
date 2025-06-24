/*
 * Copyright 2022 The Backstage Authors
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

/** Configuration for the devportal plugin behavior */
export interface Config {
  /**
   *
   * @visibility frontend
   */
  kong?: {
    instances?: Array<{
      id: string;
      apiBaseUrl: string;
      workspace: string;
      auth: {
        kongAdmin?: string;
        custom?: {
          header: string;
          value: string;
        };
      };
    }>;
  };
  vee?: {
    openai?: {
      apiBaseUrl: string;
      apiKey: string;
      model: string;
    };
  };
  /**
   *
   * @visibility frontend
   */
  enabledPlugins: {
    /**
     * vault launch control.
     * @visibility frontend
     */
    rbac: boolean;
    /**
     * vault launch control.
     * @visibility frontend
     */
    vault: boolean;

    /**
     * vault kubernetes control.
     * @visibility frontend
     */
    kubernetes: boolean;

    /**
     * vault launch control.
     * @visibility frontend
     */
    grafana: boolean;
    /**
     * gitlabPlugin launch control.
     * @visibility frontend
     */
    gitlabPlugin: boolean;

    /**
     * keycloakPlugin launch control.
     * @visibility frontend
     */
    keycloak: boolean;
    /**
     * AzureDevops Plugin launch control.
     * @visibility frontend
     */
    azureDevops: boolean;
    /**
     * Kong Plugin launch control.
     * @visibility frontend
     */
    kong: boolean;
    /**
     * Vee Plugin launch control.
     * @visibility frontend
     */
    vee: boolean;
    /**
     * Sonarqube Plugin launch control.
     * @visibility frontend
     */
    sonarqube: boolean;
  };
  /**
   *
   * @visibility frontend
   */
  platform: {
    /**
     *
     * @visibility frontend
     */
    signInProviders: Array<string>;
    guest: {
      /**
       *
       * @visibility frontend
       */
      enabled: boolean;
      /**
       *
       * @visibility frontend
       */
      demo: boolean;
    };
    defaultGroup: {
      /**
       *
       * @visibility frontend
       */
      enabled: boolean;
    };
    groups: {
      /**
       *
       * @visibility frontend
       */
      admin: string;
      /**
       *
       * @visibility frontend
       */
      user: string;
    };
    apiManagement: {
      /**
       *
       * @visibility frontend
       */
      enabled: boolean;
    };
  };
  /**
   * Configuration options for notifications-backend
   */
  notifications?: {
    /**
     * Concurrency limit for notification sending, defaults to 10
     */
    concurrencyLimit?: number;
    /**
     * Throttle duration between notification sending, defaults to 50ms
     */
    throttleInterval?: HumanDuration | string;
    /**
     * Time to keep the notifications in the database, defaults to 365 days.
     * Can be disabled by setting to false.
     */
    retention?: HumanDuration | string | false;
  };
}
