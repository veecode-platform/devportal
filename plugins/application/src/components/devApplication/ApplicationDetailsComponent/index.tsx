import React from 'react';
import { Grid, Button, makeStyles, Card, CardHeader, IconButton, Divider } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Link, Progress, TabbedLayout } from '@backstage/core-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useLocation, Link as RouterLink } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import {
  InfoCard,
  Header,
  Page,
} from '@backstage/core-components';
import EditIcon from '@material-ui/icons/Edit';
import { IApplication } from '../interfaces';
import CachedIcon from '@material-ui/icons/Cached';
import { DefaultDetailsComponent } from '../../shared';

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

  return (
    <Page themeId="tool" >
      <Header title={application?.name}> </Header>
      {/* TESTE */}
      <TabbedLayout>
        <TabbedLayout.Route path="/" title="OVERVIEW">
          <Card className={classes.gridItemCard} >
            <Grid style={{ marginBottom: "2vw" }} item lg={12} direction='column' >
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
              <Grid container direction='column' spacing={6}  lg={12}>
                {/* <InfoCard variant="gridItem">

                  <Grid style={{ margin: "2vw" }} item xs={12}>
                    <Grid container spacing={6} >
                      <Grid item lg={3} xs={6}>
                        <h1>App id</h1>
                        <p>{application?.id}</p>
                      </Grid>
                      <Grid item lg={3} xs={6}>
                        <h1>Created</h1>
                        <p>{application?.createdAt}</p>
                      </Grid>
                      <Grid item lg={3} xs={6}>
                        <h1>Redirect Url</h1>
                        <p>https://example.com</p>
                      </Grid>
                      <Grid item lg={3} xs={6}>
                        <h1>Services</h1>
                        <p>{application?.servicesId}</p>
                      </Grid>
                      <Grid item lg={3} xs={6}>
                        <h1>Kong Consumer Name</h1>
                        <p>{application?.kongConsumerName}</p>
                      </Grid>
                      <Grid item lg={3} xs={6}>
                        <h1>Kong Consumer Id</h1>
                        <p>{application?.kongConsumerId}</p>
                      </Grid>
                      <Grid item lg={3} xs={6}>
                        <h1>Description</h1>
                        <p>{application?.description ?? 'Some Description for Application...'}</p>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid style={{ margin: "2vw" }} item xs={12} >
                    <Grid container justifyContent='center' alignItems='center' spacing={2}>
                      <Grid item><Button component={RouterLink} to='/application' variant='contained' size='large'>Cancel</Button></Grid>
                    </Grid>
                  </Grid>
                </InfoCard> */}
                <DefaultDetailsComponent metadata={application}/>
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
    const response = await fetch(`http://localhost:7007/api/application/${id}`);
    const data = await response.json();
    // eslint-disable-next-line no-console
    console.log(data.application)
    return data.application;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <Details application={value} />

}