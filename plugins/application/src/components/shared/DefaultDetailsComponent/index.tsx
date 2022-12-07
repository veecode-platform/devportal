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

type Props = {
    metadata : any[] | any;
    back: string;
    remove?: string
}

export const DefaultDetailsComponent = ({metadata, back, remove}:Props) => (
    <Wrapper>
        <div style={cardContentStyle}>
            <StructuredMetadataTable metadata={metadata} dense={false} />
        </div>
        <Grid container justifyContent='center' alignItems='center' spacing={2} style={{ marginTop: "3em", paddingBottom: '1em' }}>
            <Grid item><Button component={RouterLink} to={back} variant='contained' size='large'>Cancel</Button></Grid>
            {remove && <Grid item><Button component={RouterLink} to={remove} variant='contained' size='large'>Remove</Button></Grid>}
        </Grid>
    </Wrapper>
);