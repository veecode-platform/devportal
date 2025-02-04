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
  * @visibility frontend
  */
  proxy?: {
    /** @visibility frontend */
    endpoints?: {
      /** @visibility frontend */
      [key: string]:
      | string
      | {
        /** @visibility frontend */
        target: string;
        /** @visibility frontend */
        allowedHeaders?: string[];
        /** @visibility frontend */
        workspace?: string;
        /** @visibility frontend */
        headers?: {
          /** @visibility secret */
          Authorization?: string;
          /** @visibility secret */
          authorization?: string;
          /** @visibility secret */
          'X-Api-Key'?: string;
          /** @visibility secret */
          'x-api-key'?: string;
          [key: string]: string | undefined;
        };
      };
    };
  }
  /**
  * Configuration for integrations towards various external repository provider systems
  * @visibility frontend
  */
  integrations?: {
    /**
     * Integration configuration for Bitbucket
     * @deprecated replaced by bitbucketCloud and bitbucketServer
     */
    bitbucket?: Array<{
      /**
       * The hostname of the given Bitbucket instance
       * @visibility frontend
       */
      host: string;
      /**
       * Token used to authenticate requests.
       * @visibility secret
       */
      token?: string;
      /**
       * The base url for the Bitbucket API, for example https://api.bitbucket.org/2.0
       * @visibility frontend
       */
      apiBaseUrl?: string;
      /**
       * The username to use for authenticated requests.
       * @visibility secret
       */
      username?: string;
      /**
       * Bitbucket app password used to authenticate requests.
       * @visibility secret
       */
      appPassword?: string;
    }>;

    /** Integration configuration for Bitbucket Cloud */
    bitbucketCloud?: Array<{
      /**
       * The username to use for authenticated requests.
       * @visibility secret
       */
      username: string;
      /**
       * Bitbucket Cloud app password used to authenticate requests.
       * @visibility secret
       */
      appPassword: string;
    }>;

    /** Integration configuration for Bitbucket Server */
    bitbucketServer?: Array<{
      /**
       * The hostname of the given Bitbucket Server instance
       * @visibility frontend
       */
      host: string;
      /**
       * Token used to authenticate requests.
       * @visibility secret
       */
      token?: string;
      /**
       * Username used to authenticate requests with Basic Auth.
       * @visibility secret
       */
      username?: string;
      /**
       * Password (or token as password) used to authenticate requests with Basic Auth.
       * @visibility secret
       */
      password?: string;
      /**
       * The base url for the Bitbucket Server API, for example https://<host>/rest/api/1.0
       * @visibility frontend
       */
      apiBaseUrl?: string;
    }>;
    /** Integration configuration for GitHub */
    github?: Array<{
      /**
       * The hostname of the given GitHub instance
       * @visibility frontend
       */
      host: string;
      /**
       * Token used to authenticate requests.
       * @visibility secret
       */
      token?: string;
      /**
       * The base url for the GitHub API, for example https://api.github.com
       * @visibility frontend
       */
      apiBaseUrl?: string;
      /**
       * The base url for GitHub raw resources, for example https://raw.githubusercontent.com
       * @visibility frontend
       */
      rawBaseUrl?: string;

      /**
       * GitHub Apps configuration
       */
      apps?: Array<{
        /**
         * The numeric GitHub App ID, string for environment variables
         */
        appId: number | string;
        /**
         * The private key to use for auth against the app
         * @visibility secret
         */
        privateKey: string;
        /**
         * The secret used for webhooks
         * @visibility secret
         */
        webhookSecret: string;
        /**
         * The client ID to use
         */
        clientId: string;
        /**
         * The client secret to use
         * @visibility secret
         */
        clientSecret: string;
        /**
         * List of installation owners allowed to be used by this GitHub app. The GitHub UI does not provide a way to list the installations.
         * However you can list the installations with the GitHub API. You can find the list of installations here:
         * https://api.github.com/app/installations
         * The relevant documentation for this is here.
         * https://docs.github.com/en/rest/reference/apps#list-installations-for-the-authenticated-app--code-samples
         */
        allowedInstallationOwners?: string[];
      }>;
    }>;

    /** Integration configuration for GitLab */
    gitlab?: Array<{
      /**
       * The host of the target that this matches on, e.g. "gitlab.com".
       *
       * @visibility frontend
       */
      host: string;
      /**
       * The base URL of the API of this provider, e.g.
       * "https://gitlab.com/api/v4", with no trailing slash.
       *
       * May be omitted specifically for public GitLab; then it will be deduced.
       *
       * @visibility frontend
       */
      apiBaseUrl?: string;
      /**
       * The authorization token to use for requests to this provider.
       *
       * If no token is specified, anonymous access is used.
       *
       * @visibility secret
       */
      token?: string;
      /**
       * The baseUrl of this provider, e.g. "https://gitlab.com", which is
       * passed into the GitLab client.
       *
       * If no baseUrl is provided, it will default to https://${host}.
       *
       * @visibility frontend
       */
      baseUrl?: string;
    }>;
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
    vault: boolean

    /**
     * kubernetes launch control.
     * @visibility frontend
     */
    kubernetes: boolean

    /**
     * grafana launch control.
     * @visibility frontend
     */
    grafana: boolean

    /**
     * gitlabPlugin launch control.
     * @visibility frontend
     */
    gitlabPlugin: boolean

    /**
     * KeycloakPlugin launch control.
     * @visibility frontend
     */
    keycloak: boolean
    /**
     * AzureDevops Plugin launch control.
     * @visibility frontend
     */
    azureDevops: boolean
    /**
     * Kong Plugin launch control.
     * @visibility frontend
     */
    kong: boolean

  };
  /**
   * 
   * @visibility frontend
   */
  auth?: {
    /**
     * 
     * @visibility frontend
     */
    providers?: {
      /**
       * 
       * @visibility frontend
       */
      oidc?: {
        /**
         * 
         * @visibility frontend
         */
        development?: {
          /**
           * 
           * @visibility frontend
           */
          metadataUrl?: string
          /**
           * 
           * @visibility frontend
           */
          clientId?: string
        }
      }
    }
  }
  /**
   * 
   * @visibility frontend
   */
  platform: {
    /**
    * 
    * @visibility frontend
    */
    behaviour: {
      /**
      * 
      * @visibility frontend
      */
      mode: string
      /**
      * 
      * @visibility frontend
      */
      home?: boolean
      /**
      * 
      * @visibility frontend
      */
      catalog?: boolean
      /**
      * 
      * @visibility frontend
      */
      apis?: boolean
      /**
      * 
      * @visibility frontend
      */
      clusters?: boolean
      /**
      * 
      * @visibility frontend
      */
      enviroments?: boolean
      /**
      * 
      * @visibility frontend
      */
      create?: boolean
      /**
      * 
      * @visibility frontend
      */
      docs?: boolean
      /**
      * 
      * @visibility frontend
      */
      groups?: boolean
      /**
      * 
      * @visibility frontend
      */
      apiManagement?: boolean
    };
    /**
    * @visibility frontend
    */
    logo?: {
      /**
      * @visibility frontend
      */
      icon?: string
      /**
      * @visibility frontend
      */
      full?: string
    };
    guest: {
      /**
       * 
       * @visibility frontend
       */
      enabled: boolean
      /**
       * 
       * @visibility frontend
       */
      demo: boolean
    };
    defaultGroup: {
      /**
       * 
       * @visibility frontend
       */
      enabled: boolean
    };
    group: {
      /**
       * 
       *  @visibility frontend
       */
      admin: string
      /**
       * 
       * @visibility frontend
       */
      user: string
    };
    apiManagement: {
      /**
       * 
       * @visibility frontend
       */
      enabled: boolean
      /**
       * 
       * @visibility frontend
       */
      readOnlyMode: boolean
    }
    support?: {
      /**
       * 
       * @visibility frontend
       */
      licenseKey?: string
    }
  }
  /**
  * Configuration for scaffolder towards various external repository provider systems
  * @visibility frontend
  */
  scaffolder?: {
    /**
      * @visibility frontend
      */
    providers?: {
      /** Integration configuration for GitHub */
      github?: Array<{
        /**
         * The hostname of the given GitHub instance
         * @visibility frontend
         */
        host: string;
        /**
         * Token used to authenticate requests.
         * @visibility frontend
         */
        token?: string;
      }>;

      /** Integration configuration for Gitlab */
      gitlab?: Array<{
        /**
         * The hostname of the given Gitlab instance
         * @visibility frontend
         */
        host: string;
        /**
         * Token used to authenticate requests.
         * @visibility frontend
         */
        token?: string;
      }>;
    }
  },
  /** @visibility frontend */
  zoraOss?: {
    /** @visibility frontend */
    openAiApiKey?: string;
    /** @visibility frontend */
    openAiModel?: string;
  },
}
