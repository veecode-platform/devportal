import React, { PropsWithChildren } from 'react';
import { Grid, Button } from '@material-ui/core';
import { StructuredMetadataTable } from '@backstage/core-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link as RouterLink } from 'react-router-dom';

const cardContentStyle = { heightX: 'auto', width: '100%', marginLeft: '2%' };


const Wrapper = ({ children }: PropsWithChildren<{}>) => (
    <Grid container spacing={4} style={{ width: '100%', marginTop: '.5em' }}>
        <Grid item lg={12}>{children}</Grid>
    </Grid>
);

export const DefaultDetailsComponent = (props:any) => (
    <Wrapper>
        <div style={cardContentStyle}>
            <StructuredMetadataTable metadata={props.metadata} dense={false} />
        </div>
        <Grid container justifyContent='center' alignItems='center' spacing={2} style={{ marginTop: "3em", paddingBottom: '1em' }}>
            <Grid item><Button component={RouterLink} to='/credentials' variant='contained' size='large'>Cancel</Button></Grid>
            <Grid item><Button component={RouterLink} to='/credentials' variant='contained' size='large'>Remove</Button></Grid>
        </Grid>
    </Wrapper>
);