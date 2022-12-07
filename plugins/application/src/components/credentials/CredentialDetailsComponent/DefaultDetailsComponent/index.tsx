// eslint-disable-next-line import/no-extraneous-dependencies
import { Link as RouterLink } from 'react-router-dom';
import React, { PropsWithChildren } from 'react';
import { Grid, Button } from '@material-ui/core';
import { StructuredMetadataTable } from '@backstage/core-components';

const cardContentStyle = { heightX: 'auto', width: '100%', marginLeft: '2%' };

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
    <Grid container spacing={4} style={{ width: '100%', marginTop: '.5em' }}>
        <Grid item lg={12}>{children}</Grid>
    </Grid>
);

// add interface for props
export const DefaultDetailsComponent = ({data}:any) => (
    <Wrapper>
        <div style={cardContentStyle}>
            <StructuredMetadataTable metadata={data} dense={false} />
        </div>
        <Grid container justifyContent='center' alignItems='center' spacing={2} style={{ marginTop: "5em" }}>
            <Grid item><Button component={RouterLink} to='/credentials' variant='contained' size='large'>Cancel</Button></Grid>
            <Grid item><Button component={RouterLink} to='/credentials' variant='contained' size='large'>Remove</Button></Grid>
        </Grid>
    </Wrapper>
);