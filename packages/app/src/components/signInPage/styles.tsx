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

export const useStyles = makeStyles( theme => 
  ({
    wrapper:{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    container: {
      padding: 0,
      listStyle: 'none',
      width: '65vw',
      minWidth:'320px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logo:{
      width: '80vw',
      padding: '2em',
      display: 'flex',
      justifyContent:'center',
      alignItems: 'center'
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
      background: '#1c8068',
      borderRadius: '.3rem',
      outline: 'none',
      border: '2px solid #33FFCE',
      margin: '1em 0',
      cursor: 'pointer',
      fontSize: '16px',
      color: '#FAFAFA',
      transition: 'all 0.5s linear',
      '&:hover':{
        background: '#33FFCE',
        color: '#151515',
        transition: 'all 0.5s linear',
      }
    },
    loginBox:{
      width: '100%',
      padding: '1rem',
      borderRadius: '18px',
      margin: ' 1rem auto',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      flexDirection: 'column',
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
      background: theme.palette.background.default,
      border: `1px solid ${theme.palette.action.active}`,
    },
    providerTitleBar:{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      margin: '.5rem auto',
      fontSize: '1.2rem',
    },
    providerLogo:{
      width: '60px'
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
  }),
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