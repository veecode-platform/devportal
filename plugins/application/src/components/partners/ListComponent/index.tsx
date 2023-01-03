import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FetchComponent } from '../FetchComponent';
import { PageDefault } from '../../shared';

export const ListComponent = () => (
  <PageDefault
  title="Partners"
  add="create-partner"
  labelButton="CREATE PARTNER"
  refresh='/partners'
  >
  <FetchComponent/>
  </PageDefault>
 );
