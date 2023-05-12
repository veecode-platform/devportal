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

    };
    /**
     * 
     * @visibility frontend
     */
    platform: {
        guest: {
            /**
             * 
             * @visibility frontend
             */
            enabled: boolean
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
    }
    // /**
    //  * 
    //  * @visibility frontend
    //  */
    // kong: {
    // }
  }
