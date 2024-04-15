import { Content, Header, InfoCard, Page } from '@backstage/core-components'
import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, makeStyles } from '@material-ui/core';
import React from 'react';
import { IoMdMail } from "react-icons/io";
import { FaDiscord } from "react-icons/fa6";
import { HiMiniDocumentText } from "react-icons/hi2";
import { BsCursorFill } from "react-icons/bs";
import { FaAws } from "react-icons/fa6";

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
                        <IoMdMail size={32} />
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
                  href="https://discord.gg/vsUPgbyV"
                  target="_blank"
                >
                  <ListItem className={classes.listItem}>
                    <ListItemAvatar>
                      <Avatar>
                        <FaDiscord size={32} />
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
                        <HiMiniDocumentText size={32} />
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
                        <BsCursorFill size={32} />
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
                        <FaAws size={36} />
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