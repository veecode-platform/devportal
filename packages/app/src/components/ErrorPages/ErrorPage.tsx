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

import Box, { BoxProps } from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { CollaborationIllustration } from './illustrations/collaboration/collaboration';

interface ErrorPageProps {
  /** The title to display. */
  title: React.ReactNode | string;
  /** The message to display. */
  message: React.ReactNode | string;
  /** Additional actions to display below the message. */
  actions?: React.ReactNode;
  /** Additional content to display below the message and above the actions. */
  children?: React.ReactNode;
  /** The component to use for the illustration. */
  Illustration?: React.ComponentType<BoxProps<'img'>>;
}

const ErrorPageGutters = {
  xs: 3,
  md: 6,
  lg: 9,
  xl: 12,
};

export const ErrorPage = ({
  title,
  message,
  actions,
  Illustration = CollaborationIllustration,
  children,
}: ErrorPageProps) => (
  <Grid container sx={{ flexGrow: 1, height: '100vh' }} spacing={0}>
    <Grid
      item
      xs={12}
      md={6}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          px: ErrorPageGutters,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h1" gutterBottom>
          {title}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          {message}
        </Typography>

        {children}
        <div data-testid="error-page-actions">{actions}</div>
      </Box>
    </Grid>
    <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
      <Illustration
        sx={{
          maxWidth: '100%',
          maxHeight: '100vh',
          objectFit: 'contain',
          px: ErrorPageGutters,
        }}
      />
    </Grid>
  </Grid>
);
