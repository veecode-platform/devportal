import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FetchListComponent } from '../FetchListComponent';
import { PageDefault } from '../../shared';


export const CredentialsListComponent = () => (
 <PageDefault
  title="Credentials"
  add="new-credential"
  labelButton="New Key Credential"
  >
  <FetchListComponent/>
  </PageDefault>
);
