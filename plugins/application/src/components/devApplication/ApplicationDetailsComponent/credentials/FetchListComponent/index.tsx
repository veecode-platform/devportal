/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Table, TableColumn, Progress } from '@backstage/core-components';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {AlertComponent} from '../../../../shared';
import { ICredentials } from '../interfaces';
import AxiosInstance from '../../../../../api/Api';

type DenseTableProps = {
  applicationId: string,
  credentials: ICredentials[];
};

export const DenseTable = ({applicationId, credentials} : DenseTableProps) => {
  const [show, setShow] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [messageStatus, setMessageStatus] = useState<string>('');

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') return;
    setShow(false);
  };

  const columns: TableColumn[] = [
    { title: 'Id', field: 'id', width: '1fr' },
    { title: 'Key', field: 'key', width: '1fr' },
    {title: 'Type', field: 'type', width: '1fr'},
    { title: 'Actions', field: 'actions', width: '1fr' },
  ];

  const removeCredential = async (applicationID: string, credentialID: string) => {

    const response = await AxiosInstance.delete(`/api/devportal/applications/${applicationID}/${credentialID}`)
    if (response.data.ok) {
      setShow(true);
      setStatus('success');
      setMessageStatus('Credential deleted!');
      setTimeout(()=>{
        window.location.replace('/application'); 
      }, 2000);
    }
    else{
      setShow(true);
      setStatus('error');
      setMessageStatus('An error has occurred');
    }
  };

  const data = credentials.map(item => {
    return {
      id: item.id,
      key: item.key,
      actions: (
        <Button
          variant="outlined"
          onClick={() => removeCredential(applicationId,item.id)}
          component={RouterLink}
          to=""
          style={{ border: 'none' }}
        >
          {' '}
          <DeleteOutlineIcon />{' '}
        </Button>
      ),
    };
  });

  return (
    <>
      <AlertComponent
        open={show}
        close={handleClose}
        message={messageStatus}
        status={status}
      />
      <Table
        title={`All Credentials (${credentials.length})`}
        options={{ search: true, paging: true }}
        columns={columns}
        data={data}
        style={{ width: '100%', border: 'none' }}
      />
    </>
  );
};

export const FetchListComponent = ({ idApplication }: { idApplication: string }) => {
  // list Credentias
  const { value, loading, error } = useAsync(async (): Promise<
    ICredentials[]
  > => {
    const response =  await AxiosInstance.get(`/api/devportal/applications/${idApplication}/credentials`)
    return response.data.credentials;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable  applicationId={idApplication} credentials={value || []} />;
};
