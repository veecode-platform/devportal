import React from 'react';
import { Table, TableColumn, Progress} from '@backstage/core-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link as RouterLink} from 'react-router-dom';
import { Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
// Mock
import Mock from '../Mock/mock.json';

// type DenseTableProps = {
//   applications: IApplication[];
// };

export const DenseTable = () => {

  const columns: TableColumn[] = [
    { title: 'Id', field: 'id' },
    {title: 'Key', field: 'key'},
    { title: "Created At", field: "created"},
    {title: "Details", field:"details"},
    {title:'Actions', field:"actions"}
  ];

  const data = Mock.map(item => {
    return {
      id: item.id,
      key: item.key,
      created: item.created,
      details: <Button variant='outlined' component={RouterLink} to="details"> <MoreHorizIcon/> </Button> ,
      actions: <Button variant='outlined' component={RouterLink} to="delete" style={{border:'none'}}> <DeleteOutlineIcon/> </Button>
    };
  });

  return (
    <Table
      title="All Credentials"
      options={{ search: true, paging: true }}
      columns={columns}
      data={data}
      style={{width:"100%"}}
    />
  );
};

export const FetchListComponent = () => {
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

  return <DenseTable />;
};
