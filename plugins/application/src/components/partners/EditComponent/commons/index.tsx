import React from 'react';
import { Select } from '../../../shared';
import AxiosInstance from '../../../../api/Api'; 
import {
  Progress,
} from '@backstage/core-components';
import { Alert } from '@material-ui/lab';
import useAsync from 'react-use/lib/useAsync';
import { IPartner } from '../../interfaces';

export type Props = {
  partner: IPartner;
  setPartner: any;
}

export const FetchServicesList = ({partner, setPartner}: Props) => {

    const { value, loading, error } = useAsync(async (): Promise<any> => {
      const {data} = await AxiosInstance.get(`/services`);
      return data.services;
    }, []);
  
    if (loading) {
      return <Progress />;
    } else if (error) {
      return <Alert severity="error">{error.message}</Alert>;
    }
    return (
    <Select
      placeholder="Services"
      label="Services"
      items={value.map((item: any) => {
        return { ...{ label: item.name, value: item.id, key: item.id } };
        })}
      multiple
      selected={partner.servicesId}
      onChange={e => {
      setPartner({ ...partner, servicesId: e });
      }}
    />)
  };
  
  export const FetchApplicationsList = ({partner, setPartner}: Props) => {
  
    const { value, loading, error } = useAsync(async (): Promise<any> => {
      const {data} = await AxiosInstance.get(`/applications`);
      return data.applications;
    }, []);
  
    if (loading) {
      return <Progress />;
    } else if (error) {
      return <Alert severity="error">{error.message}</Alert>;
    }
    return (
    <Select
      placeholder="Applications"
      label="Applications"
      items={value.map((item: any) => {
        return { ...{ label: item.name, value: item.id, key: item.id } };
        })}
      multiple
      selected={partner.applicationId}
      onChange={e => {
      setPartner({ ...partner, applicationId: e });
      }}
    />)
  };
  
  
  