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
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

export type SignInPageClassKey = 'container' | 'item';

export const useStyles = makeStyles(
  {
    container: {
      padding: 0,
      listStyle: 'none',
    },
    logo:{
      padding: '1em',
      marginBottom: '2em',
      display: 'flex',
      justifyContent:'center'
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '400px',
      margin: 0,
      padding: 0,
    },
    button:{
      width: '120px',
      height: '56px',
      padding: '1em 0',
      background: "linear-gradient(270deg,#27a386, #1c8068)",
      borderRadius: '.3rem',
      outline: 'none',
      border: '1px solid #33FFCE',
      margin: '1em 0',
      cursor: 'pointer',
      fontSize: '16px',
      color: '#FAFAFA',
      transition: 'all 0.5s ease-in-out',
    },
    footerWrapper:{
      // width: '100%',
      marginTop: '12rem',    
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    footerText:{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2em',
      fontWeight: 'bold'
    }
    ,
    logoBackstage: {
      width: '7.5em',
      height: '1.5em'
    },
    footer:{
      display:'flex',
      alignItems:'center',
      justifyContent: 'center',
      fontSize: '1.3em',
      gap: '10px'
    }
  },
  { name: 'BackstageSignInPage' },
);

export const GridItem = ({ children }: { children: JSX.Element }) => {
  const classes = useStyles();

  return (
    <Grid component="li" item classes={classes}>
      {children}
    </Grid>
  );
};