import React from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import { EntityGrafanaDashboardsCard, EntityGrafanaAlertsCard } from '@k-phoen/backstage-plugin-grafana';

export default function GrafanaEntity() {
    // const config = useApi(configApiRef)
    // const grafanaEnabled = config.getBoolean("enabledPlugins.grafana")

    // if(!grafanaEnabled) return null;
    return (
    <>
        <Grid item lg={6} md={12} xs={12}>
            <EntityGrafanaDashboardsCard />
        </Grid>
        <Grid item lg={6} md={12} xs={12}>
            <EntityGrafanaAlertsCard />
        </Grid>
    </>
    )
    
}
