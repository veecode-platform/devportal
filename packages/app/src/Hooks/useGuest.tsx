import { configApiRef, useApi } from "@backstage/core-plugin-api";

export function useGuest() {
    const config = useApi(configApiRef);
    const Guest = config.getOptionalBoolean("platform.guest.enabled") || false;
    return Guest;
}
