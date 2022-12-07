import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FetchListComponent } from '../FetchListComponent';
import { PageDefault } from '../../shared';

export const ApplicationListComponent = () => (
  <PageDefault
  title="Application for Partners"
  add="new-application"
  labelButton="CREATE APPLICATION"
  refresh='/application/'
  >
  <FetchListComponent/>
  </PageDefault>
 );
