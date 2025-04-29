import React from "react";
import { useApi } from "@backstage/core-plugin-api";
import { useEntity } from "@backstage/plugin-catalog-react";
import type { Entity } from "@backstage/catalog-model";
import { Box, Paper, Typography } from "@material-ui/core";
import useAsync from "react-use/esm/useAsync";
import { vulnerabilitiesApiRef } from "../../api/vulnerabilitiesApi";
import { useEntityAnnotation } from "../../hooks/useAnnotation";
import { ExitToApp } from "@material-ui/icons";
import { useVulnerabilitiesStyles } from "./styles";
import { VulnerabilityChip } from "./vulnerabilityChip";
import { Progress, ResponseErrorPanel } from "@backstage/core-components";
import { VulnerabilitiesOverviewCardWrapperProps } from "./types";


const VulnerabilitiesOverviewCardWrapper : React.FC<VulnerabilitiesOverviewCardWrapperProps> = ({children}) => {
    const { root, footer, buttonStyle } = useVulnerabilitiesStyles()
    return (
        <Paper className={root}>
          <Typography variant="h4">Vulnerabilities - Continous Integration</Typography>
          <Typography color="secondary" variant="subtitle2">Found in the last scan: 2025-04-02T17;49Z</Typography>
           {children}
          <Box component="footer" className={footer}>
            <button className={buttonStyle}><ExitToApp/></button>
          </Box>
        </Paper>
    )
}

export const VulnerabilitiesOverviewCard = () => {

    const { entity } = useEntity();
    const { location } = useEntityAnnotation(entity as Entity)
    const vulnerabilitiesApi = useApi(vulnerabilitiesApiRef);
    const { vulnerabilitiesChips } = useVulnerabilitiesStyles()

    const { value, error, loading } = useAsync(async ()=>{
      return vulnerabilitiesApi.fetchVulnerabititiesFromRepository(location!)
    },[entity])

    if(loading) (
        <VulnerabilitiesOverviewCardWrapper>
            <Progress/>
        </VulnerabilitiesOverviewCardWrapper>
    )

    if(error) (
      <VulnerabilitiesOverviewCardWrapper>
        <ResponseErrorPanel error={error} />;
      </VulnerabilitiesOverviewCardWrapper>
    )
    
    return (
        <VulnerabilitiesOverviewCardWrapper>
          <Box component="div" className={vulnerabilitiesChips}>
            <VulnerabilityChip variant="critical" value={value?.critical ?? 0}/>
            <VulnerabilityChip variant="high" value={value?.high ?? 0} />
            <VulnerabilityChip variant="medium" value={value?.medium ?? 0}/>
            <VulnerabilityChip variant="low" value={value?.low ?? 0}/>
          </Box>
        </VulnerabilitiesOverviewCardWrapper>
    )
}