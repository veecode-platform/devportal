import { configApiRef, useApi } from "@backstage/core-plugin-api";

export function useIntegrations() {
    const config = useApi(configApiRef);
    const integrations = config.getConfig('integrations');
    //gitlab
    const gitlabIntegrationsExists = integrations.has('gitlab');
    const gitlabIntegrations = integrations.get('gitlab') as any[];
    const gitlabTokenIntegration = gitlabIntegrations[0].tokenFrontEnd;
    //github
    const githubIntegrationsExists = integrations.has('github');
    const githubIntegrations = integrations.get('github') as any[];
    const githubTokenIntegration = githubIntegrations[0].tokenFrontEnd;

    return {
        gitlabIntegrationsExists,
        gitlabTokenIntegration,
        githubIntegrationsExists,
        githubTokenIntegration
    };
}
