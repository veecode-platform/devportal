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
  /** Configurations for the backstage(janus) instance */
  developerHub?: {
    /**
     * The url of json data for customization.
     * @visibility frontend
     */
    proxyPath?: string;
    /**
     * Name of the Backstage flavor (e.g. backstage, rhdh, rhtap)
     * @visibility frontend
     */
    flavor?: string;
  };
  app: {
    branding?: {
      /**
       * Base64 URI for the full logo
       * @visibility frontend
       */
      fullLogo?: string;
      /**
       * Base64 URI for the full logo
       * @visibility frontend
       */
      fullLogoDark?: string;
      /**
       * size Configuration for the full logo
       * The following units are supported: <number>, px, em, rem, <percentage>
       * @visibility frontend
       */
      fullLogoWidth?: string | number;
      /**
       * Base64 URI for the icon logo
       * @visibility frontend
       */
      iconLogo?: string;
      /**
       * @deepVisibility frontend
       */
      theme?: {
        [key: string]: unknown;
      };
    };
    support?: {
      /**
       * Support url
       * @visibility frontend
       */
      url?: string;
    };
    sidebar?: {
      /**
       * Show the logo in the sidebar
       * @visibility frontend
       */
      logo?: boolean;
      /**
       * Show the search in the sidebar
       * @visibility frontend
       */
      search?: boolean;
      /**
       * Show the settings in the sidebar
       * @visibility frontend
       */
      settings?: boolean;
      /**
       * Show the administration in the sidebar
       * @visibility frontend
       */
      administration?: boolean;
    };
  };
  /** @deepVisibility frontend */
  dynamicPlugins: {
    /** @deepVisibility frontend */
    frontend?: {
      [key: string]: {
        dynamicRoutes?: {
          path: string;
          module?: string;
          importName?: string;
          menuItem?: {
            icon: string;
            text: string;
            enabled?: boolean;
          };
          config: {
            props?: {
              [key: string]: string;
            };
          };
        }[];
        routeBindings?: {
          targets?: {
            module?: string;
            importName: string;
            name?: string;
          }[];
          bindings?: {
            bindTarget: string;
            bindMap: {
              [key: string]: string;
            };
          }[];
        };
        entityTabs?: {
          path: string;
          title: string;
          mountPoint: string;
          priority?: number;
        }[];
        mountPoints?: {
          mountPoint: string;
          module?: string;
          importName?: string;
          config: {
            layout?: {
              [key: string]:
              | string
              | {
                [key: string]: string;
              };
            };
            props?: {
              [key: string]: string;
            };
            if?: {
              allOf?: (
                | {
                  [key: string]: string | string[];
                }
                | string
              )[];
              anyOf?: (
                | {
                  [key: string]: string | string[];
                }
                | string
              )[];
              oneOf?: (
                | {
                  [key: string]: string | string[];
                }
                | string
              )[];
            };
          };
        }[];
        appIcons?: {
          module?: string;
          importName?: string;
          name: string;
        }[];
        apiFactories?: {
          module?: string;
          importName?: string;
        }[];
        providerSettings?: {
          title: string;
          description: string;
          provider: string;
        }[];
        scaffolderFieldExtensions?: {
          module?: string;
          importName?: string;
        }[];
        signInPage?: {
          module?: string;
          importName: string;
        };
        techdocsAddons?: {
          module?: string;
          importName?: string;
          config?: {
            props?: {
              [key: string]: string;
            };
          };
        }[];
        themes?: {
          module?: string;
          id: string;
          title: string;
          variant: 'light' | 'dark';
          icon: string;
          importName?: string;
        }[];
      };
    };
  };
  /**
   * The signInPage provider
   * @visibility frontend
   */
  signInPage?: string;
  /**
   * The option to includes transient parent groups when determining user group membership
   * @visibility frontend
   */
  includeTransitiveGroupOwnership?: boolean;

  /**
   * Allows you to customize RHDH Metadata card
   * @deepVisibility frontend
   */
  buildInfo?: {
    title: string;
    card: { [key: string]: string };
    full?: boolean;
  };
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
  };
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
          metadataUrl?: string;
          /**
           *
           * @visibility frontend
           */
          clientId?: string;
        };
      };
    };
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
    /**
      *
      * @visibility frontend
      */
    enabledPlugins: {
      /**
       * vault launch control.
       * @visibility frontend
       */
      vault: boolean;
      /**
       * grafana launch control.
       * @visibility frontend
       */
      grafana: boolean;

      /**
       * gitlabPlugin launch control.
       * @visibility frontend
       */
      gitlabPlugin: boolean;

      /**
       * KeycloakPlugin launch control.
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



    support?: {
      /**
       *
       * @visibility frontend
       */
      licenseKey?: string;
    };
  };
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
    };
  };
  /** @visibility frontend */
  zoraOss?: {
    /** @visibility frontend */
    openAiApiKey?: string;
    /** @visibility frontend */
    openAiModel?: string;
  };
  /**
   * vulnerabilities.
   * @visibility frontend
   */
  vulnerabilities?: {
    /**
     * enable vulnerabilities.
     * @visibility frontend
     */
    enabled: boolean;
  };
}
