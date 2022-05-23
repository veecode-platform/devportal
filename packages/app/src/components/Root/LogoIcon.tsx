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

import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  align: {
    width: 60,
    height: 'auto',
    paddingRight: '30px'
  },
});
const LogoIcon = () => {
  const classes = useStyles();

  return (
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
    width="70.000000pt" height="70.000000pt" viewBox="0 0 80.000000 79.000000"
    preserveAspectRatio="xMidYMid meet" className={classes.align}>
    
      <g transform="translate(0.000000,79.000000) scale(0.100000,-0.100000)"
      fill="#3883e7" stroke="none">
      <path d="M147 674 c-15 -8 -32 -26 -37 -40 -6 -14 -10 -120 -10 -235 0 -238 4
      -255 70 -289 39 -20 70 -26 70 -14 0 4 -23 40 -50 80 -55 80 -70 125 -50 149
      18 22 29 19 66 -22 39 -43 43 -31 13 46 -23 62 -22 119 4 135 36 23 64 -21 82
      -129 9 -54 21 -29 29 63 7 83 28 132 55 132 37 0 44 -24 38 -133 l-6 -102 25
      55 c37 80 71 122 97 118 37 -5 29 -85 -17 -181 -43 -90 -42 -126 2 -85 63 59
      104 69 117 28 9 -28 -9 -62 -61 -113 -34 -33 -43 -47 -31 -47 23 0 76 27 105
      53 22 20 22 25 22 244 0 256 -4 275 -68 292 -20 6 -127 11 -237 11 -159 -1
      -206 -4 -228 -16z"/>
      </g>
   </svg>
  );
};

export default LogoIcon;

