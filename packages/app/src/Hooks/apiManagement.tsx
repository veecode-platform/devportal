import { configApiRef, useApi } from "@backstage/core-plugin-api";

export function useApiManagement() {
const config = useApi(configApiRef);
const ApiManagement = config.getBoolean("apiManagement.enabled");
return ApiManagement;
}
