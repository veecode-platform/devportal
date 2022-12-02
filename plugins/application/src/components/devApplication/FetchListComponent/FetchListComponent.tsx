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
    { title: 'Name', field: 'name' },
    { title: 'Id', field: 'id' },
    { title: "Created At", field: "created"},
    {title: "Created By", field:"creator"},
    { title: 'Details', field: 'details' },
  ];

  const data = applications.map(application => {
    return {
      name: application.name,
      id: application.id,
      created: application.createdAt,
      creator: application.creator,
      details: <Button variant='outlined' component={RouterLink} to={`/application/details?id=${application.id}`}> <More/> </Button>
    };
  });

  return (
    <Table
      title="All Applications"
      options={{ search: false, paging: true }}
      columns={columns}
      data={data}
    />
  );
};

export const FetchListComponent = () => {
  const { value, loading, error } = useAsync(async (): Promise<IApplication[]> => {
    const response = await fetch('http://localhost:7007/api/application/');
    const data = await response.json();
    // eslint-disable-next-line no-console
    // console.log(data.applications[0])
    return data.applications;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable applications={value || []} />;
};