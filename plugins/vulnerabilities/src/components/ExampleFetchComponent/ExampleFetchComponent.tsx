import React from 'react';
import {
  Table,
  TableColumn,
  Progress,
} from '@backstage/core-components';
import { RepoVulnerability } from '../../utils/types';

const columns: TableColumn[] = [
  { title: 'Application', field: 'repo' },
  { title: 'Total', field: 'total', type: 'numeric' },
  { title: 'Critical', field: 'critical', type: 'numeric' },
  { title: 'High', field: 'high', type: 'numeric' },
  { title: 'Medium', field: 'medium', type: 'numeric' },
  { title: 'Low', field: 'low', type: 'numeric' },
];

type ComponentParams = {
  value: RepoVulnerability[] | undefined;
  loading: boolean;
}

export const ExampleFetchComponent = ({ value, loading }: ComponentParams) => {
  if (loading) return <Progress />;

  return (
    <Table
      title="Security Insights - CVEs por Repositório"
      options={{ search: false, paging: false }}
      columns={columns}
      data={value ?? []}
    />
  );
};
