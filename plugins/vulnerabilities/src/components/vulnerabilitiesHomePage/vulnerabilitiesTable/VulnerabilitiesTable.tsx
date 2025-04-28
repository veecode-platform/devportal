import React from 'react';
import {
  Table,
  TableColumn,
} from '@backstage/core-components';
import { VulnerabilityTableProps } from './types';

const columns: TableColumn[] = [
  { title: 'Application', field: 'repo' },
  { title: 'Total', field: 'total', type: 'numeric' },
  { title: 'Critical', field: 'critical', type: 'numeric' },
  { title: 'High', field: 'high', type: 'numeric' },
  { title: 'Medium', field: 'medium', type: 'numeric' },
  { title: 'Low', field: 'low', type: 'numeric' },
];

export const VulnerabilitiesTable : React.FC<VulnerabilityTableProps> = ({value, loading}) => (
    <Table
      title="Security Insights - CVEs by Repository"
      options={{ search: false, paging: false }}
      columns={columns}
      data={value ?? []}
      isLoading={loading}
    />
  );
