import { Header, InfoCard, Page, Progress, TabbedLayout } from '@backstage/core-components'
import { Avatar, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, makeStyles } from '@material-ui/core';
import React from 'react';
import { VeecodeLogoIcon } from './DevportalIcon';
import { BackstageLogoIcon } from './BackstageLogoIcon';
import { Alert } from '@material-ui/lab';
import { useInfo } from '../../hooks';

const useStyles = makeStyles(theme => ({
  paperStyle: {
    marginBottom: theme.spacing(2),
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  copyButton: {
    float: 'left',
    margin: theme.spacing(2),
  },
}))

export const DefaultAboutPage = () => {

  const classes = useStyles();
  const { about, loading, error } = useInfo();

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Page themeId="tool">
      <Header title="About" subtitle=""> </Header>
        <TabbedLayout>
        <TabbedLayout.Route path="/" title="Info">
          <Grid container direction="row" spacing={3}>
            <Grid item xs={12} md={6}>
              <InfoCard title="Details">
                <List className={classes.flexContainer}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <VeecodeLogoIcon/>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                    primary="Devportal Version"
                    secondary={"123"}
                    />
                  </ListItem>
                  <Divider orientation="vertical" variant="middle" flexItem />
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <BackstageLogoIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Backstage Version"
                      secondary={about?.backstageVersion}
                    />
                  </ListItem>               
                </List>
              </InfoCard>
            </Grid>
          </Grid>
        </TabbedLayout.Route>
        </TabbedLayout>
    </Page>
  )
}