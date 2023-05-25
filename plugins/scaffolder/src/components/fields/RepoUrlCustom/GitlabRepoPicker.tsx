import React, { useEffect, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Select, SelectItem } from '@backstage/core-components';
import { RepoUrlPickerState } from './types';
import { useIntegrations } from '../../hooks/useIntegrations';
import { getOrgs, getOwner } from '../../services';
import { Grid } from '@material-ui/core';

export const GitlabRepoPicker = (props: {
  allowedOwners?: string[];
  allowedRepos?: string[];
  state: RepoUrlPickerState;
  onChange: (state: RepoUrlPickerState) => void;
  rawErrors: string[];
}) => {
  const { allowedOwners = [], state, onChange, rawErrors } = props;
  const ownerItems: SelectItem[] | SelectItem = allowedOwners
    ? allowedOwners.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const { owner } = state;

  const [ownerData, setOwnerData ] = useState<string>("loading ...");
  const [orgs, setOrgs] = useState<string[]>();
  const [orgsItems, setOrgsItems] = useState<SelectItem[]>();
  const { gitlabTokenIntegration } = useIntegrations();
  const messageLoading = "loading ...";

  const ownerList = [
    {
      label: ownerData,
      value: ownerData
    }
  ];

  const orgsList = () : SelectItem[] => {
    if(orgs !== undefined){
      const organizations:SelectItem[] = []
      orgs.forEach((item : string) =>{
         organizations.push({
          label: item,
          value: item
        })
      })
      return organizations;
    }
    else{
      return [{
        label: messageLoading,
        value: messageLoading
      }]
    }
  }
  
  useEffect(()=>{
      async function fetchData(){
        const getOwnerData = getOwner({provider: 'gitlab', token: gitlabTokenIntegration});
        const getOrgsData = getOrgs({provider: 'gitlab', token: gitlabTokenIntegration})

        try{
          const ownerDataResult = await getOwnerData;
          const orgsDataResult = await getOrgsData;

          setOwnerData(ownerDataResult);
          setOrgs([...orgsDataResult]);

        }catch(err){
          console.log(err)
          setOwnerData(messageLoading);
          setOrgs([messageLoading]);
        }
      }
      fetchData()
  },[]);

  useEffect(()=>{
    const data = orgsList();
    setOrgsItems( data != undefined ? data : [{label: messageLoading, value: messageLoading}]);
  },[orgs])

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
            onChange={selected =>
              onChange({
                owner: String(Array.isArray(selected) ? selected[0] : selected),
              })
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
              disabled={allowedOwners.length === 0}
              selected={ownerData}
              items={ownerList}
            />
          </Grid>
          <Grid item style={{marginBottom:'1rem'}}>
            <Select
              native
              label="Organizations"
              onChange={s =>
                onChange({ owner: String(Array.isArray(s) ? s[0] : s) })
              }
              disabled={allowedOwners.length === 1}
              selected={owner}
              items={orgsItems as SelectItem[]}
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
