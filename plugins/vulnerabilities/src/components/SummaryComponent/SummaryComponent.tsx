import React from 'react';
import { Grid, Typography, Card, CardContent } from '@material-ui/core';
import { Progress } from '@backstage/core-components';
import { SummaryProps } from './types';

export const SecurityInsightSummary : React.FC<SummaryProps> = ({
  value = [],
  loading,
}) => {
  if (loading) return <Progress />;

  const summary = value.reduce(
    (acc, repo) => {
      acc.total += repo.total;
      acc.critical += repo.critical;
      acc.high += repo.high;
      acc.medium += repo.medium;
      acc.low += repo.low;
      return acc;
    },
    { total: 0, critical: 0, high: 0, medium: 0, low: 0 },
  );

  const { total, critical, high, medium, low } = summary;

  return (
    <Card>
      <CardContent>
        <Grid container spacing={4} justifyContent="flex-start">
          <Grid item xs={1}>
            <Typography variant="h4">{total}</Typography>
            <Typography variant="subtitle2">Vulnerabilities</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h4" style={{ color: 'red' }}>
              {critical}
            </Typography>
            <Typography variant="subtitle2">Critical</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h4" style={{ color: 'orange' }}>
              {high}
            </Typography>
            <Typography variant="subtitle2">High</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h4" style={{ color: 'yellow' }}>
              {medium}
            </Typography>
            <Typography variant="subtitle2">Medium</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="h4">{low}</Typography>
            <Typography variant="subtitle2">Low</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
