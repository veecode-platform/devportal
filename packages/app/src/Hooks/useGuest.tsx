import { configApiRef, useApi } from "@backstage/core-plugin-api";

export function useGuest() {
    const config = useApi(configApiRef);
    const Guest = config.getBoolean("enabledGuest.enabled");
    return Guest;
}
