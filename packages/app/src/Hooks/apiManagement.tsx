import { configApiRef, useApi } from "@backstage/core-plugin-api";

export function useApiManagement() {
const config = useApi(configApiRef);
const ApiManagement = config.getOptionalBoolean("platform.apiManagement.enabled") || false;
return ApiManagement;
}
