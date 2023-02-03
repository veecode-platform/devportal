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
    width="70.000000pt" height="60.000000pt" viewBox="0 0 128.000000 147.000000"
    preserveAspectRatio="xMidYMid meet" className={classes.align}>

              <g transform="translate(0.000000,147.000000) scale(0.100000,-0.100000)"
              fill="#FFFFFF" stroke="none">
              <path d="M356 1228 c28 -93 156 -156 483 -239 85 -21 159 -43 164 -48 6 -6 3
              -50 -8 -116 -19 -115 -15 -155 5 -53 6 35 20 85 31 113 10 27 15 53 11 57 -4
              4 -109 53 -232 108 -124 56 -273 123 -332 151 -121 56 -132 58 -122 27z"/>
              <path d="M345 999 c11 -53 40 -112 67 -137 34 -31 111 -42 294 -42 188 0 214
              4 214 36 0 13 -8 28 -18 33 -10 5 -94 25 -187 45 -143 30 -233 53 -359 93 -16
              5 -17 2 -11 -28z"/>
              <path d="M418 719 c-13 -8 18 -63 55 -97 55 -52 130 -49 325 13 112 36 127 47
              104 81 -8 12 -465 14 -484 3z"/>
              <path d="M765 530 c-82 -27 -157 -49 -165 -50 -8 0 -21 -4 -29 -9 -21 -13 2
              -39 56 -63 36 -16 49 -17 85 -7 44 11 238 105 238 115 0 6 -30 64 -33 64 -1
              -1 -69 -23 -152 -50z"/>
              <path d="M860 358 c-58 -38 -106 -74 -108 -79 -6 -15 51 -31 87 -25 40 6 159
              83 166 107 7 21 -14 69 -29 68 -6 0 -58 -32 -116 -71z"/>
              <path d="M990 235 l-64 -64 28 -11 c59 -22 94 -2 135 78 21 41 21 41 2 52 -11
              5 -23 10 -28 10 -5 0 -37 -29 -73 -65z"/>
              </g>

    </svg>
  );
};

export default LogoIcon;

