/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Grid, makeStyles, Card, CardHeader, IconButton } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Link, Progress, TabbedLayout } from '@backstage/core-components';
import { useLocation } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import {
  Header,
  Page,
} from '@backstage/core-components';
import EditIcon from '@material-ui/icons/Edit';
import { IApplication } from '../interfaces';
import CachedIcon from '@material-ui/icons/Cached';
import { DetailsComponent } from './DetailsComponent';
import AxiosInstance from '../../../api/Api';

type Application = {
  application: IApplication | undefined;
}

// makestyles
const useStyles = makeStyles({
  gridItemCard: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 10px)', // for pages without content header
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

const Details = ({ application }: Application) => {
  const classes = useStyles();

  const Refresh = () => {
    window.location.reload()
  }

  const ApplicationData = {
    id: application?.id ?? '...',
    name: application?.name ?? '...',
    creator: application?.creator ?? '...',
    servicesId: application?.servicesId ?? '...',
    active: application?.active ?? true,
    kongConsumerName: application?.kongConsumerName ?? '...',
    kongConsumerId: application?.kongConsumerId ?? '...',
    createdAt: application?.createdAt ?? '...',
    updateAt: application?.updateAt ?? '...'
  }

  return (
    <Page themeId="tool" >
      <Header title={application?.name}> </Header>
      <TabbedLayout>
        <TabbedLayout.Route path="/" title="OVERVIEW">
          <Card className={classes.gridItemCard} >
            <Grid style={{ marginBottom: "2vw" }} item lg={12} >
              <CardHeader
                title="Details"
                id="overview"
                style={{ padding: "2em" }}
                action={
                  <>
                    <IconButton
                      component={Link}
                      aria-label="Edit"
                      title="Edit Metadata"
                      to={`/application/edit-application?id=${application?.id}`}
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
              <Grid container direction='column' spacing={6}>
                <DetailsComponent metadata={ApplicationData} back="/application" />
              </Grid>
            </Grid>
          </Card>
        </TabbedLayout.Route>
      </TabbedLayout>
    </Page>
  );

}


export const ApplicationDetailsComponent = () => {
  const location = useLocation();
  const id = location.search.split("?id=")[1];

  const { value, loading, error } = useAsync(async (): Promise<IApplication> => {
    /* const response = await fetch(`http://localhost:7007/api/application/${id}`);
    const data = await response.json();*/
    const response = await AxiosInstance.get(`/applications/${id}`)
    return response.data.application;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <Details application={value} />

}