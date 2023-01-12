/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import { MenuItem } from '@material-ui/core';
import { Select } from '../../../../shared';
import { IKongServices } from '../../interfaces';

type KongServicesArray = {
  services: IKongServices[];
  value: any;
  setValue: any;
};

export const KongServicesListComponent = ({
  services,
  value,
  setValue,
}: KongServicesArray) => {
  return (
    <Select
      placeholder="Kong Service Name"
      label="Kong Service Name"
      items= { services.map(item=>{
        return{
          label: item.name,
          value: item.name
        }
      })}
      onChange={e => {
        setValue(e);
      }}
      />
  );
};
