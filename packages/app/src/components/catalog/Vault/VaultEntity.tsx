import React from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import { EntityVaultCard } from '@backstage/plugin-vault';

export default function VaultEntity() {
    // const config = useApi(configApiRef)
    // const vaultEnabled = config.getBoolean("enabledPlugins.vault")

    // if(!vaultEnabled) return null;
    return (
        <Grid item lg={6} md={12} xs={12}>
            <EntityVaultCard />
        </Grid>
    )
    
}


