import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FetchComponent } from '../FetchComponent';
import { PageDefault } from '../../shared';

export const ListComponent = () => (
  <PageDefault
  title="Services"
  add="create-service"
  labelButton="CREATE SERVICE"
  refresh='/services'
  >
  <FetchComponent/>
  </PageDefault>
 );
