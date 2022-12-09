import React, { useState } from 'react';
import { Table, TableColumn, Progress } from '@backstage/core-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
// Mock
import Mock from '../Mock/mock.json';
import AlertComponent from '../../Alert/Alert';

// type DenseTableProps = {
//   applications: IApplication[];
// };

export const DenseTable = ({ handleClick }: any) => {

  const columns: TableColumn[] = [
    { title: 'Id', field: 'id', width: '1fr' },
    { title: 'Key', field: 'key', width: '1fr' },
    { title: 'Actions', field: "actions", width: '1fr' }
  ];

  const data = Mock.map(item => {
    return {
      id: item.id,
      key: item.key,
      actions: <Button variant='outlined' onClick={handleClick} component={RouterLink} to="" style={{ border: 'none' }}> <DeleteOutlineIcon /> </Button>
    };
  });

  return (
    <Table
      title="All Credentials"
      options={{ search: true, paging: true }}
      columns={columns}
      data={data}
      style={{ width: "100%", border: "none" }}
    />
  );
};

export const FetchListComponent = () => {

  const [show, setShow] = useState<boolean>(false);

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') return;
    setShow(false);
  };

  const generateCredential = () => {
    setShow(true)
    // eslint-disable-next-line no-console
    console.log(show)
  }
  const { value, loading, error } = useAsync(async (): Promise<any[]> => {
    const response = await fetch('http://localhost:7007/api/application/');
    const data = await response.json();
    return data.applications;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <>
      <AlertComponent open={show} close={handleClose} message="Credential deleted!" />
      <DenseTable handleClick={generateCredential} />
    </>
  );
};
