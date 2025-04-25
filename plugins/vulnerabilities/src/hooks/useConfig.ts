import { configApiRef, useApi } from "@backstage/core-plugin-api";

export function useConfig() {
    const config = useApi(configApiRef);

    const token = config.getConfig("scaffolder")?.getConfig("providers").getConfigArray("github")?.[0]?.getOptionalString("token");
    return {
        token
    }
}