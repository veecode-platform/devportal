/*
 * Copyright Red Hat, Inc.
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

declare module '@backstage/config' {
  interface Config {
    app?: {
      branding?: {
        /**
         * Base64 URI for the full logo
         * @visibility frontend
         */
        fullLogo?: string;
        /**
         * Base64 URI for the full log DarkMode
         * @visibility frontend
         */
        fullLogoDarkMode?: string;
        /**
         * @visibility frontend
         */
        theme?: {
          /**
           * @visibility frontend
           */
          light?: {
            /**
             * @visibility frontend
             */
            primaryColor?: string;
            /**
             * @visibility frontend
             */
            headerColor1?: string;
            /**
             * @visibility frontend
             */
            headerColor2?: string;
            /**
             * @visibility frontend
             */
            navigationIndicatorColor?: string;
          };
          /**
           * @visibility frontend
           */
          dark?: {
            /**
             * @visibility frontend
             */
            primaryColor?: string;
            /**
             * @visibility frontend
             */
            headerColor1?: string;
            /**
             * @visibility frontend
             */
            headerColor2?: string;
            /**
             * @visibility frontend
             */
            navigationIndicatorColor?: string;
          };
        };
      };
      support?: {
        /**
         * @visibility frontend
         */
        url?: string;
      };
    };
  }
}
