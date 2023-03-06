import React from 'react';
import { EntityVaultCard } from '@backstage/plugin-vault';

export default function VaultEntity() {
    // const config = useApi(configApiRef)
    // const vaultEnabled = config.getBoolean("enabledPlugins.vault")

    // if(!vaultEnabled) return null;
    return (
            <EntityVaultCard />
    )
    
}


