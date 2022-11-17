import React from 'react';
import { Table, TableColumn, Progress} from '@backstage/core-components';
import { Link as RouterLink} from 'react-router-dom';
import { Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';


type User = {
  id: string; 
  creator: string;
  name: string; 
  serviceName: string; 
  description: string; 
  active: string; 
  statusKong: string; 
  createdAt: string; 
  updatedAt: string; 
  consumerName: string;

};

type DenseTableProps = {
  users: User[];
};

export const DenseTable = ({ users }: DenseTableProps) => {

  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Id', field: 'id' },
    { title: "Created At", field: "created"},
    { title: 'Details', field: 'details' },
  ];

  const data = users.map(user => {
    return {
      name: user.name,
      id: user.id,
      created: user.createdAt,
      details: <Button variant='outlined' component={RouterLink} to={`/services/service-details?id=${user.id}`}>&gt;&gt;&gt;</Button>
    };
  });

  return (
    <Table
      title="All services"
      options={{ search: false, paging: true }}
      columns={columns}
      data={data}
    />
  );
};

export const FetchComponent = () => {
  const { value, loading, error } = useAsync(async (): Promise<User[]> => {
    const response = await fetch('http://localhost:7007/api/application');
    const data = await response.json();
    //console.log(data)
    return data.applications;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable users={value || []} />;
};