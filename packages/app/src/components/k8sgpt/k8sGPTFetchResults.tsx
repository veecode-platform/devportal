import React, { useEffect, useState } from 'react';
import { useCustomResources} from '@backstage/plugin-kubernetes';
import { CustomResourceMatcher } from '@backstage/plugin-kubernetes-common';
import { useEntity} from '@backstage/plugin-catalog-react';
import { Progress, Table, TableColumn } from '@backstage/core-components';

interface CustomResourcesProps {
  children?: React.ReactNode;
}

// retrieve k8sgpt results no matter what is configured in app-config.yaml
const customResourceMatchers: CustomResourceMatcher[] = [
  {
    group: 'core.k8sgpt.ai',
    apiVersion: 'v1alpha1',
    plural: 'results'
  }
];

const columns: TableColumn<Result>[] = [
  {
    title: 'cluster',
    width: '10%',
    render: (row: Result) => row.clusterName,
  },
  {
    title: 'namespace',
    width: '10%',
    render: (row: Result) => row.resourceNamespace,
  },
  {
    title: 'kind',
    width: '10%',
    render: (row: Result) => row.resourceKind,
  },
  {
    title: 'name',
    width: '30%',
    render: (row: Result) => row.resourceName,
  },
  {
    title: 'details',
    width: '40%',
    render: (row: Result) => row.details,
  },
];

interface Result {
  clusterName: string;
  resourceNamespace: string;
  resourceName: string;
  resourceKind: string;
  details: string;
}

export const K8sGPTFetchResults = ({}: CustomResourcesProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { entity } = useEntity();
  const { kubernetesObjects } = useCustomResources(entity,customResourceMatchers);

  const results: Result[] = []

  if (kubernetesObjects != undefined) {
    for (let item of kubernetesObjects?.items) {
      const clusterName = item.cluster.name;
      for (let resource of item.resources[0].resources) {
        const result: Result = {
          clusterName: clusterName,
          resourceNamespace: resource.spec.name.split('/').shift(),
          resourceName: resource.spec.name.split('/').pop(),
          resourceKind: resource.spec.kind,
          details: resource.spec.details
        }
        results.push(result)
      }
    }
  }

  useEffect(()=>{
    setLoading(true);
    setTimeout(()=>setLoading(false),1000);
  },[])

  if(loading) return <Progress/>

  return (
        <Table
          title="K8sGPT Results"
          data={results??[]}
          columns={columns}
          options={{ paging: true, search: false, emptyRowsWhenPaging: false }}
        />
  );
};