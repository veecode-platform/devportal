import React, { PropsWithChildren, useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import { CardTab, StructuredMetadataTable, TabbedCard } from '@backstage/core-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link as RouterLink } from 'react-router-dom';
import { Credentials } from '../../../credentials';
import AlertComponent from '../../../Alert/Alert';

const cardContentStyle = { heightX: 'auto', width: '100%', marginLeft: '2%' };


const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <Grid container spacing={4} style={{ width: '100%', marginTop: '.5em', display: 'flex', justifyContent: 'center' }}>
    <Grid item lg={12}>{children}</Grid>
  </Grid>
);

type Props = {
  metadata: any[] | any;
  back: string;
  remove?: string
}

export default {
  title: 'Layout/Tabbed Card',
  component: TabbedCard,
  decorators: [
    (storyFn: () => JSX.Element) => (
      <Grid container spacing={4}>
        <Grid item>{storyFn()}</Grid>
      </Grid>
    ),
  ],
};


export const DetailsComponent = ({ metadata, back, remove }: Props) => {

  const [show, setShow] = useState<boolean>(false);

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') return;
    setShow(false);
  };

  const generateCredential = () => {
    setShow(true)
    // eslint-disable-next-line no-console
    console.log(show)
  }


  return (
    <Wrapper>
      <div style={cardContentStyle}>
        <Wrapper>
          <TabbedCard>
            <CardTab label="About">
              <StructuredMetadataTable metadata={metadata} dense={false} />
              <Grid container justifyContent='center' alignItems='center' spacing={2} style={{ padding: '3em 0' }}>
                <Grid item><Button component={RouterLink} to={back} variant='contained' size='large'>Cancel</Button></Grid>
                {remove && <Grid item><Button component={RouterLink} to={remove} variant='contained' size='large'>Remove</Button></Grid>}
              </Grid>
            </CardTab>
            <CardTab label="Credentials">
              <AlertComponent open={show} close={handleClose} message="Credential created!" />
              <Credentials />
              <Grid container justifyContent='center' alignItems='center' spacing={2} style={{ padding: '3em 0' }}>
                <Grid item><Button onClick={generateCredential} variant='contained' size='large'>New Credential Key</Button></Grid>
                <Grid item><Button component={RouterLink} to={back} variant='contained' size='large'>Cancel</Button></Grid>
              </Grid>
            </CardTab>
          </TabbedCard>
        </Wrapper>
      </div>
    </Wrapper>
  )
};