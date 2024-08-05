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

import {
    AuthMetadata,
    AuthenticationStrategy,
    KubernetesCredential,
} from '@backstage/plugin-kubernetes-node';
import { VeecodeClusterDetails } from './customClusterLocator';
import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';

/**
 *
 * @public
 */
export class VeecodeCustomAuthStrategy implements AuthenticationStrategy {
    public async getCredential(
        clusterDetails: VeecodeClusterDetails,
    ): Promise<KubernetesCredential> {

        const kc = new KubeConfig();
        kc.loadFromDefault();
        
        const k8sApi = kc.makeApiClient(CoreV1Api);
        const secretName = clusterDetails.secretName || `${clusterDetails.name}-secret`
        const namespace = clusterDetails.namespace

        const response = (await k8sApi.readNamespacedSecret(secretName, namespace)).body.data?.token

        if(!response){
            console.log("CLUSTER AUTH ERROR: ", k8sApi )
            throw new Error("Impossible to fetch token secret from config")
        }

        const token = Buffer.from(response, 'base64').toString('utf-8');

        return { type: 'bearer token', token };
        
      
    }

    public validateCluster(): Error[] {
        return [];
    }

    public presentAuthMetadata(_authMetadata: AuthMetadata): AuthMetadata {
        return {};
    }
}