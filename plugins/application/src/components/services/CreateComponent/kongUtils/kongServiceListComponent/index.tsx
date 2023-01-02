/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import { Select, MenuItem } from '@material-ui/core';
import { IKongServices } from '../../../interfaces';

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
      fullWidth
      variant="outlined"
      value={value}
      displayEmpty
      onChange={e => {
        setValue(e.target.value as string);
      }}
      >
      <MenuItem value="">
        <em>Service name</em>
      </MenuItem>
      {services.map(item => {
        return (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        );
      })}
    </Select>
  );
};
