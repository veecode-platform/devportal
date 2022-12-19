/* eslint-disable no-console */
import React, { PropsWithChildren, useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import {
  CardTab,
  StructuredMetadataTable,
  TabbedCard,
} from '@backstage/core-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link as RouterLink } from 'react-router-dom';
import { Credentials } from '../../../credentials';
import AlertComponent from '../../../Alert/Alert';

const cardContentStyle = { heightX: 'auto', width: '100%', marginLeft: '2%' };

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <Grid
    container
    spacing={4}
    style={{
      width: '100%',
      marginTop: '.5em',
      display: 'flex',
      justifyContent: 'center',
    }}
  >
    <Grid item lg={12}>
      {children}
    </Grid>
  </Grid>
);

type Props = {
  metadata: any[] | any;
  back: string;
  remove?: string;
};

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
  const [status, setStatus] = useState<string>('');
  const [messageStatus, setMessageStatus] = useState<string>('');

  const kongConsumerId = metadata ? metadata.kongConsumerId : '';

  const handleClose = (reason: string) => {
    if (reason === 'clickaway') return;
    setShow(false);
  };

  // generate Credentials
  const generateCredential = async (ID: string) => {
    const config = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    };
    const response = await fetch(
      `http://localhost:7007/api/application/credencial/${ID}?workspace=default`,  // ====>>> TO DO
      config,
    );
    console.log("A RESPOOOOOOOOOOOSTAAA",response);
    if (response.ok) {
      setShow(true);
      setStatus('success');
      setMessageStatus('Credential created!');
      setTimeout(()=>{
        window.location.reload();
      },2000)
    }
    else {
      setShow(true);
      setStatus('error');
      setMessageStatus('An error has occurred');
    }
  };

  return (
    <Wrapper>
      <div style={cardContentStyle}>
        <Wrapper>
          <TabbedCard>
            <CardTab label="About">
              <StructuredMetadataTable metadata={metadata} dense={false} />
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={2}
                style={{ padding: '3em 0' }}
              >
                <Grid item>
                  <Button
                    component={RouterLink}
                    to={back}
                    variant="contained"
                    size="large"
                  >
                    Cancel
                  </Button>
                </Grid>
                {remove && (
                  <Grid item>
                    <Button
                      component={RouterLink}
                      to={remove}
                      variant="contained"
                      size="large"
                    >
                      Remove
                    </Button>
                  </Grid>
                )}
              </Grid>
            </CardTab>
            <CardTab label="Credentials">
              <AlertComponent
                open={show}
                close={handleClose}
                message={messageStatus}
                status={status}
              />
              <Credentials idConsumer={kongConsumerId} />
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={2}
                style={{ padding: '3em 0' }}
              >
                <Grid item>
                  <Button
                    onClick={() => generateCredential(kongConsumerId)}
                    variant="contained"
                    size="large"
                  >
                    New Credential Key
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    component={RouterLink}
                    to={back}
                    variant="contained"
                    size="large"
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </CardTab>
          </TabbedCard>
        </Wrapper>
      </div>
    </Wrapper>
  );
};
