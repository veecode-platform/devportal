/*
 * Portions of this file are based on code from the Red Hat Developer project:
 * https://github.com/redhat-developer/rhdh/blob/main/packages/app
 *
 * Original Copyright (c) 2022 Red Hat Developer (or the exact copyright holder from the original source, please verify in their repository)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { AppComponents } from '@backstage/core-plugin-api';

import Box from '@mui/material/Box';

import { ContactSupportButton } from './errorButtons/ContactSupportButton';
import { GoBackButton } from './errorButtons/GoBackButton';
import { ErrorPage } from './ErrorPage';

export const NotFoundErrorPage: AppComponents['NotFoundErrorPage'] = ({
  children,
}) => (
  <ErrorPage
    title={
      <>
        <strong>404</strong> We couldn't find that page
      </>
    }
    message="The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable."
    actions={
      <Box sx={{ display: 'flex', gap: 2 }}>
        <GoBackButton />
        <ContactSupportButton />
      </Box>
    }
  >
    {children}
  </ErrorPage>
);
