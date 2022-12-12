import React, { useState } from 'react';
import { Table, TableColumn, Progress } from '@backstage/core-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AlertComponent from '../../Alert/Alert';
import { ICredentials } from '../interfaces';

type DenseTableProps = {
  credentials: ICredentials[];
};

export const DenseTable = ({ credentials }: DenseTableProps) => {
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
    { title: 'Actions', field: 'actions', width: '1fr' },
  ];

  // remove Credential    ======================================================================================> //TO DO
  const removeCredential = async (ID: string) => {
    const config = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    };
    const response = await fetch(
      `http://localhost:7007/api/application/credencial/${ID}`,
      config,
    );
    if (response.status === 200) {
      setShow(true);
      setStatus('success');
      setMessageStatus('Credential created!');
    }
    // eslint-disable-next-line no-alert
    if (response.status !== 200) {
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
          onClick={() => removeCredential(item.id)}
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

export const FetchListComponent = ({ idConsumer }: { idConsumer: string }) => {
  // list Credentias
  const { value, loading, error } = useAsync(async (): Promise<
    ICredentials[]
  > => {
    const response = await fetch(
      `http://localhost:7007/api/application/credencial/${idConsumer}?workspace=default`,  // TO DO
    );
    const data = await response.json();
    return data.credentials;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable credentials={value || []} />;
};
