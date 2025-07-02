/* eslint-disable no-restricted-syntax */
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

import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(theme => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3),
    gridAutoFlow: 'dense',
    alignItems: 'start',
  },
}));

type GridProps = React.PropsWithChildren<
  { container?: boolean; item?: boolean } & BoxProps
>;

const Grid: React.FC<GridProps> = ({
  container = false,
  item = true,
  children,
  ...props
}) => {
  const { classes } = useStyles();

  if (container) {
    return (
      <Box {...props} className={classes.grid}>
        {children}
      </Box>
    );
  }

  if (item) {
    return <Box {...props}>{children}</Box>;
  }

  return null;
};

export default Grid;
