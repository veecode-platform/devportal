import React from 'react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { EntityVaultCard } from '@backstage/plugin-vault';


export default function VaultEntity() {
    const config = useApi(configApiRef)
    const vaultEnabled = config.getBoolean("enabledPlugins.vault")

    if(!vaultEnabled) return null;
    return (<EntityVaultCard />)
    
}


