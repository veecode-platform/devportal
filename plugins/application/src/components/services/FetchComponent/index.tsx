/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Table, TableColumn, Progress} from '@backstage/core-components';
import { Link as RouterLink} from 'react-router-dom';
import { Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import { IService } from '../interfaces';
import More from '@material-ui/icons/MoreHorizOutlined';

type DenseTableProps = {
  services: IService[];
};

export const DenseTable = ({ services }: DenseTableProps) => {

  const columns: TableColumn[] = [
    { title: 'Name', field: 'name',width:'1fr' },
    { title: 'Id', field: 'id',width:'1fr' },
    { title: "Created At", field: "created",width:'1fr'},
    { title: 'Details', field: 'details',width:'1fr'},
  ];

  const data = services.map(service => {
    return {
      name: service.name,
      id: service.id,
      created: service.createdAt,
      details: <Button variant='outlined' component={RouterLink} to={`/services/service-details?id=${service.id}`}><More/></Button>
    };
  });

  return (
    <Table
      title={`All Services (${services.length})`}
      options={{ search: true, paging: true }}
      columns={columns}
      data={data}
    />
  );
};

export const FetchComponent = () => {
  const { value, loading, error } = useAsync(async (): Promise<IService[]> => {
    const response = await fetch('http://localhost:7007/api/application/services');
    const data = await response.json();
    return data.services;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable services={value || []} />;
};