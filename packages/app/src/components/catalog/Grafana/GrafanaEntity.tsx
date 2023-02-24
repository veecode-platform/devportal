import React from 'react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import Grid from '@material-ui/core/Grid/Grid';
import { EntityGrafanaDashboardsCard, EntityGrafanaAlertsCard } from '@k-phoen/backstage-plugin-grafana';

export default function GrafanaEntity() {
    // const config = useApi(configApiRef)
    // const grafanaEnabled = config.getBoolean("enabledPlugins.grafana")

    // if(!grafanaEnabled) return null;
    return (
    <>
        <Grid item md={6} xs={12}>
            <EntityGrafanaDashboardsCard />
        </Grid>
        <Grid item md={6} xs={12}>
            <EntityGrafanaAlertsCard />
        </Grid>
    </>
    )
    
}
