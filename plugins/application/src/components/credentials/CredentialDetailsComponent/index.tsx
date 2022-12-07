import React from 'react';
import { Grid, makeStyles, Card, CardHeader, IconButton } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Progress, TabbedLayout } from '@backstage/core-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useLocation } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import {
  Header,
  Page,
} from '@backstage/core-components';
import CachedIcon from '@material-ui/icons/Cached';
// Mock
import Mock from "../Mock/mock.json"
import { DefaultDetailsComponent } from './DefaultDetailsComponent';

// type Application = {
//   application: IApplication | undefined;
// }

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


const Details = () => {
  const classes = useStyles();

  const Refresh = () => {
    window.location.reload()
  }

  return (
    <Page themeId="tool" >
      <Header title="Credential Details"> </Header>
      <TabbedLayout>
        <TabbedLayout.Route path="/" title="Description">
          <Card className={classes.gridItemCard} >
            <Grid style={{ marginBottom: "2vw" }} item lg={12} direction='column' >
              <CardHeader
                title="Details"
                id="overview"
                style={{ padding: "2em" }}
                action={
                  <>
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
              <Grid container direction='column' spacing={6} lg={12}>
                <DefaultDetailsComponent data={Mock[0]} />
              </Grid>
            </Grid>
          </Card>
        </TabbedLayout.Route>
      </TabbedLayout>
    </Page>
  );

}


export const CredentialDetailsComponent = () => {
  const location = useLocation();
  const id = location.search.split("?id=")[1];

  const { value, loading, error } = useAsync(async (): Promise<any[]> => {
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
  return <Details />

}