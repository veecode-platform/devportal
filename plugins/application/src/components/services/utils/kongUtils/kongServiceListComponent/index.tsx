import React from 'react';
import { Select } from '../../../../shared';
import { IKongServices } from '../../interfaces';

type KongServicesArray = {
  services: IKongServices[];
  value: any;
  setValue: any;
  selected: any;
};

export const KongServicesListComponent = ({
  services,
  value,
  setValue,
  selected
}: KongServicesArray) => {
  return (
    <Select
      placeholder="Kong Service Name"
      label="Kong Service Name"
      selected={selected}
      items= { services.map(item=>{
        return{
          label: `${item.name} - ${item.id}`,
          value: `${item.name}---${item.id}`
        }
      })}
      onChange={e => {
        const nameId = e.toString().split("---")
        setValue({...value, kongServiceName: nameId[0], kongServiceId: nameId[1]});
      }}
      />
  );
};
