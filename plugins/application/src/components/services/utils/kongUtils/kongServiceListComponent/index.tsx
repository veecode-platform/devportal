import React from 'react';
// import { Select } from '../../../../shared';
import { IKongServices } from '../../interfaces';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';

type KongServicesArray = {
  services: IKongServices[];
  value: any;
  setValue: any;
  // selected?: any;
};

type kongServiceOption = {
  id: string;
  name: string;
}

export const KongServicesListComponent = ({
  services,
  value,
  setValue,
}: KongServicesArray) => {

  const options = services.map(item=>{
    return{
      name: item.name,
      id: item.id
    }
  })
  return (

    <Autocomplete
      id="search-kong-services"
      placeholder='Services'
      options={options}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => <TextField {...params} label="Kong service" variant="outlined" />}
      /*renderOption={(option) => (
        <div style={{display:"flex", flexDirection:"column"}}>
          <span><b>{option.name}</b></span>
          <span style={{color:"lightgray"}}>{option.id}</span>
        </div>
      )}*/
      onChange={
        (_event:any, newValue:kongServiceOption | null) =>{
          setValue({...value, kongServiceName: newValue?.name || "", kongServiceId: newValue?.id || ""});
        }
      }    
    />
   
    /* <Select
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
      />*/
  );
};
