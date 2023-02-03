import React from 'react';
import {Progress} from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import useAsync from "react-use/lib/useAsync";
import { IKongServices } from "../interfaces";
import { KongServicesListComponent } from "./kongServiceListComponent";
import AxiosInstance from '../../../../api/Api';

export const FetchKongServices = ({valueName, setValue}:any) => {

    const { value, loading, error } = useAsync(async (): Promise<IKongServices[]> => {
      const response = await AxiosInstance.get("/kong-extras/services")
      return response.data.services;
    }, []);
  
    if (loading) {
      return <Progress /> 
    } else if (error) {
      return <Alert severity="error">{error.message}</Alert>;
    }
    return <KongServicesListComponent services={value || []} value={valueName} setValue={setValue}/>
  }
  
  