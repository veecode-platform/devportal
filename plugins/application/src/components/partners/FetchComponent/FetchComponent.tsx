import React from 'react';
import { Table, TableColumn, Progress} from '@backstage/core-components';
import { Link as RouterLink} from 'react-router-dom';
import { Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';


type Partner = {
  id: string; 
  name: string;
  applicationId: Array<string>; 
  createdAt: string; 
  updatedAt: string; 
};

type DenseTableProps = {
  partners: Partner[];
};

export const DenseTable = ({ partners }: DenseTableProps) => {

  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Id', field: 'id' },
    { title: "Created At", field: "created"},
    { title: 'Details', field: 'details' },
  ];

  const data = partners.map(partner => {
    return {
      name: partner.name,
      id: partner.id,
      created: partner.createdAt,
      details: <Button variant='outlined' component={RouterLink} to={`/partners/partner-details?id=${partner.id}`}>&gt;&gt;&gt;</Button>
    };
  });

  return (
    <Table
      title="All partners"
      options={{ search: false, paging: true }}
      columns={columns}
      data={data}
    />
  );
};

export const FetchComponent = () => {
  const { value, loading, error } = useAsync(async (): Promise<Partner[]> => {
    const response = await fetch('http://localhost:7007/api/application/partners');
    const data = await response.json();
    //console.log(data)
    return data.partners;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable partners={value || []} />;
};