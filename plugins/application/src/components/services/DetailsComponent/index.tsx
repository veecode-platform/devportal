/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {
  Grid,
  makeStyles,
  Card,
  CardHeader,
  IconButton,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Progress, TabbedLayout } from '@backstage/core-components';
import { useLocation } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import { Header, Page, Link } from '@backstage/core-components';
import { IService } from '../utils/interfaces';
import EditIcon from '@material-ui/icons/Edit';
import CachedIcon from '@material-ui/icons/Cached';
import { DefaultDetailsComponent } from './DefaultDetailsComponent';
import { SecurityTypeEnum } from '../utils/enum';
import AxiosInstance from '../../../api/Api';

// makestyles
const useStyles = makeStyles({
  gridItemCard: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 10px)',
    marginBottom: '10px',
  },
  fullHeightCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  gridItemCardContent: {
    flex: 1,
  },
  fullHeightCardContent: {
    flex: 1,
  },
});

type Services = {
  service: IService | undefined;
};

const Details = ({ service }: Services) => {
  const classes = useStyles();
  const Refresh = () => {
    window.location.reload();
  };

  const serviceData = {
    id: service?.id ?? '...',
    name: service?.name ?? '...',
    active: service?.active ?? true,
    description: service?.description ?? '...',
    redirectUrl: service?.redirectUrl ?? '...',
    kongServiceName: service?.kongServiceName ?? '...',
    kongServicesId: service?.kongServiceId ?? '...',
    rateLimiting: service?.rateLimiting ?? '...',
    securityType: service?.securityType ?? SecurityTypeEnum.none,
    createdAt: service?.createdAt ?? '...',
    updatedAt: service?.updatedAt ?? '...',
  };

  return (
    <Page themeId="tool">
      <Header title={service?.name}> </Header>
      <TabbedLayout>
        <TabbedLayout.Route path="/" title="OVERVIEW">
          <Card className={classes.gridItemCard}>
            <Grid
              style={{ marginBottom: '2vw'}}
              item
              lg={12}
            >
              <CardHeader
                title="Details"
                id="overview"
                style={{ padding: '2em'}}
                action={
                  <>
                    <IconButton
                      component={Link}
                      aria-label="Edit"
                      title="Edit Metadata"
                      to={`/services/edit-service?id=${service?.id}`}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      aria-label="Refresh"
                      title="Schedule entity refresh"
                      onClick={Refresh}
                    >
                      <CachedIcon />
                    </IconButton>
                  </>
                }
              />
              <Grid container direction="column" spacing={6}>
                <DefaultDetailsComponent
                  metadata={serviceData}
                  back="/services"
                  partners={service?.partnersId}
                />
              </Grid>
            </Grid>
          </Card>
        </TabbedLayout.Route>
      </TabbedLayout>
    </Page>
  );
};

export const DetailsComponent = () => {
  const location = useLocation();
  const id = location.search.split('?id=')[1];

  const { value, loading, error } = useAsync(async (): Promise<IService> => {
    /*const response = await fetch(
      `http://localhost:7007/api/application/service/${id}`,
    );
    const data = await response.json();*/
    const {data} = await AxiosInstance.get(`/services/${id}`)
    return data.services;                             // CHECK ---- TO DO
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <Details service={value} />;
};
