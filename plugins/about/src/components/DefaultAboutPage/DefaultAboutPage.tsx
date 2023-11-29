import { Header, InfoCard, Page, Progress, TabbedLayout } from '@backstage/core-components'
import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, makeStyles } from '@material-ui/core';
import React from 'react';
import { VeecodeLogoIcon } from './DevportalIcon';
import { BackstageLogoIcon } from './BackstageLogoIcon';
import { Alert } from '@material-ui/lab';
import { useInfo } from '../../hooks';
import DescriptionIcon from '@material-ui/icons/Description';
import MemoryIcon from '@material-ui/icons/Memory';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';

const useStyles = makeStyles(theme => ({
  paperStyle: {
    marginBottom: theme.spacing(2),
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    '& > :nth-child(odd)': {
      backgroundColor: theme.palette.background.default,
      borderRadius: '4px'
    },
  }
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
            <Grid item xs={12} md={12}>
              <InfoCard title="Details">
                <List className={classes.flexContainer}>
                  {/**Devportal Version */}
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <VeecodeLogoIcon/>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                    primary="Devportal Version"
                    secondary={about?.devportalVersion}
                    />
                  </ListItem>
               
                 {/** Operating Sistem */}
                 <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <DeveloperBoardIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Operating System"
                      secondary={about?.operatingSystem}
                    />
                  </ListItem>
                 
                 {/**Resource Utilization */}
                 <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <MemoryIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Resource utilization"
                      secondary={about?.resourceUtilization}
                    />
                  </ListItem>

                  {/** Node Version */}
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <DescriptionIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="NodeJS Version"
                      secondary={about?.nodeJsVersion}
                    />
                  </ListItem>

                  {/** Backstage Version */}
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