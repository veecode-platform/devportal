/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Table, TableColumn, Progress} from '@backstage/core-components';
import { Link as RouterLink} from 'react-router-dom';
import { Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import { IPartner } from '../interfaces';
import More from '@material-ui/icons/MoreHorizOutlined';

type DenseTableProps = {
  partners: IPartner[];
};

export const DenseTable = ({ partners }: DenseTableProps) => {

  const columns: TableColumn[] = [
    { title: 'Name', field: 'name', width:'1fr' },
    { title: 'Id', field: 'id', width:'1fr' },
    { title: "Created At", field: "created", width:'1fr'},
    { title: 'Details', field: 'details', width: '1fr' },
  ];

  const data = partners.map(partner => {
    return {
      name: partner.name,
      id: partner.id,
      created: partner.createdAt,
      details: <Button variant='outlined' component={RouterLink} to={`/partners/partner-details?id=${partner.id}`}><More/></Button>
    };
  });

  return (
    <Table
      title={`All partners (${partners.length})`}
      options={{ search: true, paging: true }}
      columns={columns}
      data={data}
    />
  );
};

export const FetchComponent = () => {
  const { value, loading, error } = useAsync(async (): Promise<IPartner[]> => {
    const response = await fetch('http://localhost:7007/api/application/partners');
    const data = await response.json();
    return data.partners;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable partners={value || []} />;
};