import { Content, Header, InfoCard, Page, Progress } from '@backstage/core-components'
import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, makeStyles } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import DescriptionIcon from '@material-ui/icons/Description';
import NearMeIcon from '@material-ui/icons/NearMe';
import ForumIcon from '@material-ui/icons/Forum';
import BusinessIcon from '@material-ui/icons/Business';
import React from 'react';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';
import { licenseKeyApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsync';

const useStyles = makeStyles(theme => ({
  paperStyle: {
    marginBottom: theme.spacing(2),
  },
  content: {
    marginTop: '2rem'
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    '& > :nth-child(odd)': {
      backgroundColor: theme.palette.background.default,
      borderRadius: '4px'
    },
  },
  listItem: {
    padding: '1rem .5rem'
  }
}))

export const DefaultSupportPage = () => {

  const classes = useStyles();
  const licenseKeyApi = useApi(licenseKeyApiRef);
  const alertApi = useApi(alertApiRef);

  const { value, loading} = useAsync(async (): Promise<any> => {
    const license = await licenseKeyApi.validateLicenseKey()
    return license
  }, []);

  if (loading) {
    return <Progress />;
  }

  alertApi.post({message: value?.message || "Impossible to validate you key.", severity: value?.valid_key ? 'success' : 'error'});
  
  return (
    <Page themeId="tool">
      <Header title="Support" subtitle="" />
      <Content className={classes.content}>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12} md={12}>
            <InfoCard title="Details">
              <List className={classes.flexContainer}>
                {/** E-mail */}
                <a
                  href="mailto:platform-sales@vee.codes"
                  target="_blank"
                >
                  <ListItem className={classes.listItem}>
                    <ListItemAvatar>
                      <Avatar>
                        <MailIcon/> 
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Email"
                      secondary={<>You can contact our sales team by e-mail <strong>platform-sales@vee.code</strong></>}
                    />
                  </ListItem>
                </a>

                {/** Discord */}
                <a
                  href="https://discord.gg/pREwxeVzAD"
                  target="_blank"
                >
                  <ListItem className={classes.listItem}>
                    <ListItemAvatar>
                      <Avatar>
                        <ForumIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Discord"
                      secondary="Become a member of our free community"
                    />
                  </ListItem>
                </a>

                {/** Documentation */}
                <a
                  href="https://docs.platform.vee.codes/devportal/intro/"
                  target="_blank"
                >
                  <ListItem className={classes.listItem}>
                    <ListItemAvatar>
                      <Avatar>
                        <DescriptionIcon/>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Documentation" 
                      secondary="Check our product documentation online."
                    />
                  </ListItem>
                </a>


                {/** Site */}
                <a
                  href="https://platform.vee.codes/compare-plans/"
                  target="_blank"
                >
                  <ListItem className={classes.listItem}>
                    <ListItemAvatar>
                      <Avatar>
                        <NearMeIcon/>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="Website" 
                      secondary="Learn more about our plans and prices."
                    />
                  </ListItem>
                </a>


                {/** AWS */}
                <a
                  href="https://aws.amazon.com/marketplace/seller-profile?id=seller-6k2v2qio4njt4&ref=dtl_prodview-aybwnwq4fx2ts"
                  target="_blank"
                >
                  <ListItem className={classes.listItem}>
                    <ListItemAvatar>
                      <Avatar>
                        <BusinessIcon/>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary="AWS Marketplace" 
                      secondary="Check our product and service offerings for VeeCode Platform."
                    />
                  </ListItem>
                </a>

              </List>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
}