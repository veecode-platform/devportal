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

// import { Config } from '@backstage/config';
// import { Logger } from 'winston';
import { findPaths } from '@backstage/cli-common';
import os from 'os';
import fs from 'fs-extra';
import { DevPortalInfo } from '../utils/types';
// import { PermissionEvaluator } from '@backstage/plugin-permission-common';

/** @public */
export class AboutBackendApi {
  public constructor(
 //   private readonly logger: Logger,
 //   private readonly config: Config,
 //   private readonly permissions: PermissionEvaluator
  ) {}


  public async listInfo(): Promise<DevPortalInfo> {
    const operatingSystem = `${os.hostname()}: ${os.type} ${os.release} - ${
      os.platform
    }/${os.arch}`;
    const usedMem = Math.floor((os.totalmem() - os.freemem()) / (1024 * 1024));
    const resources = `Memory: ${usedMem}/${Math.floor(
      os.totalmem() / (1024 * 1024),
    )}MB - Load: ${os
      .loadavg()
      .map(v => v.toFixed(2))
      .join('/')}`;
    const nodeJsVersion = process.version;

    /* eslint-disable-next-line no-restricted-syntax */
    const paths = findPaths(__dirname);
    const backstageFile = paths.resolveTargetRoot('backstage.json');
    const devportalFile = paths.resolveTargetRoot('devportal.json');
    let backstageJson = undefined;
    let devportalJson = undefined;

    if (fs.existsSync(backstageFile)) {
      const buffer = await fs.readFile(backstageFile);
      backstageJson = JSON.parse(buffer.toString());
    }

    if (fs.existsSync(devportalFile)) {
        const buffer = await fs.readFile(devportalFile);
        devportalJson = JSON.parse(buffer.toString());
      }

    const info: DevPortalInfo = {
      operatingSystem: operatingSystem ?? 'N/A',
      resourceUtilization: resources ?? 'N/A',
      nodeJsVersion: nodeJsVersion ?? 'N/A',
      backstageVersion: backstageJson && backstageJson.version ? backstageJson.version : 'N/A',
      devportalVersion: devportalJson && devportalJson.version ? devportalJson.version : 'N/A',
    };

    return info;
  }
}