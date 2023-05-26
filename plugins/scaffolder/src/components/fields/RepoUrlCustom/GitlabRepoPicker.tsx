import React, { useEffect, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Select, SelectItem } from '@backstage/core-components';
import { RepoUrlPickerState } from './types';
import { useIntegrations } from '../../hooks/useIntegrations';
import { Grid } from '@material-ui/core';
import { getUserAndOrgs } from '../../services';

export const GitlabRepoPicker = (props: {
  allowedOwners?: string[];
  rawErrors: string[];
  state: RepoUrlPickerState;
  onChange: (state: RepoUrlPickerState) => void;
}) => {
  const { allowedOwners = [], rawErrors, state, onChange } = props;
  const ownerItems: SelectItem[] | SelectItem  = allowedOwners
    ? allowedOwners.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const { owner } = state;

  const [ownerData, setOwnerData ] = useState<string>("loading ...");
  const [items, setItems] = useState<string[]>();
  const [ownerList, setOwnerList] = useState<SelectItem[]>();
  const { gitlabTokenIntegration } = useIntegrations();
  const messageLoading = "loading ...";

  useEffect(()=>{
    async function fetchData(){
      const params = {provider: 'gitlab', token: gitlabTokenIntegration};
      const getData = getUserAndOrgs(params);
      try{
        const user = (await getData).username;
        const organizations = (await getData).organizations
        const ownerDataResult = [user, ...organizations];
        setOwnerData(user);
        setItems(ownerDataResult);
      }catch(err){
        console.log(err)
      }
    }
    fetchData()
},[]);


useEffect(()=>{
  const data = itemsList(items as string[]);
  setOwnerList( data != undefined ? data : [{label: messageLoading, value: messageLoading}]);
},[items]);


  const itemsList = (data:string[]) : SelectItem[] => {
    if(data !== undefined){
      const owners:SelectItem[] = []
      data.forEach((item : string) =>{
         owners.push({
          label: item,
          value: item
        })
      })
      return owners;
    }
    else{
      return [{
        label: messageLoading,
        value: messageLoading
      }]
    }
  }
  
  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !owner}
      >
        {allowedOwners?.length ? (
          <Select
            native
            label="Owner Available"
            onChange={s =>
              onChange({ owner: String(Array.isArray(s) ? s[0] : s) })
            }
            disabled={allowedOwners.length === 1}
            selected={owner}
            items={ownerItems}
          />
        ) : (
          <>
            <Grid item style={{marginBottom:'1rem'}}>
              <Select        
                native
                label="Owner"
                onChange={s =>
                  onChange({ owner: String(Array.isArray(s) ? s[0] : s) })
                }
                disabled={allowedOwners.length === 1}
                selected={ownerData}
                items={ownerList as SelectItem[]}
              />
            </Grid>
          </>
        )}
        <FormHelperText>
          GitLab namespace where this repository will belong to. It can be the
          name of organization, group, subgroup, user, or the project.
        </FormHelperText>
      </FormControl>
    </>
  );
};
