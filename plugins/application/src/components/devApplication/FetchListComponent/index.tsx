import React from 'react';
import { Table, TableColumn, Progress} from '@backstage/core-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link as RouterLink} from 'react-router-dom';
import { Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import { IApplication } from '../interfaces';
import More from '@material-ui/icons/MoreHorizOutlined';

type DenseTableProps = {
  applications: IApplication[];
};

export const DenseTable = ({ applications }: DenseTableProps) => {

  const columns: TableColumn[] = [
    { title: 'Name', field: 'name', width:'1fr' },
    { title: 'Id', field: 'id', width:'1fr'},
    {title: 'creator', field: 'creator', width:'1fr'},
    { title: "Created At", field: "created",width:'1fr'},
    {title: "Created By", field:"creator",width:'1fr'},
    { title: 'Details', field: 'details',width:'1fr' },
  ];

  const data = applications.map(application => {
    return {
      name: application.name,
      id: application.id,
      created: application.createdAt,
      creator: application.creator,
      details: <Button variant='outlined' component={RouterLink} to={`/application/details/?id=${application.id}`}> <More/> </Button>
    };
  });

  return (
    <Table
      title="All Applications"
      options={{ search: true, paging: true }}
      columns={columns}
      data={data}
    />
  );
};

export const FetchListComponent = () => {
  const { value, loading, error } = useAsync(async (): Promise<IApplication[]> => {
    const response = await fetch('http://localhost:7007/api/application/');
    const data = await response.json();
    return data.applications;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable applications={value || []} />;
};