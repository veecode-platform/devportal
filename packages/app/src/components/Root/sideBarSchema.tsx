import { ConfigApi } from "@backstage/core-plugin-api"

export type sidebarDefaultType = {
    home: boolean,
    resources: boolean,
    catalog: boolean, 
    apis: boolean, 
    create: boolean, 
    docs: boolean, 
    groups: boolean,
    apiManagement: boolean,
    signOut: boolean
}

const sideBarDefaultValues: sidebarDefaultType = {  
    home: true,
    resources: true,
    catalog: true, 
    apis: true, 
    create: true, 
    docs: true, 
    groups: false,
    apiManagement: false,
    signOut: true
}

const sideBarProduct: sidebarDefaultType = {
    ...sideBarDefaultValues,
    groups: true,
    apiManagement: false  // remove apiManagement
}

const sideBarDemo: sidebarDefaultType = {
    ...sideBarDefaultValues,
    groups: false,
    signOut: false,
    resources: false
}

const sideBarWorkshop: sidebarDefaultType = {
    ...sideBarDefaultValues
}


export function sideBarBehaviour(config: ConfigApi): sidebarDefaultType{
    const behaviour = config.getOptionalString("mode")

    switch (behaviour) {
        case "product":
            return sideBarProduct

        case "demo":
            return sideBarDemo

        case "workshop":
            return sideBarWorkshop

        default:
            return {
                home: config.getOptionalBoolean("home") ?? false,
                catalog: config.getOptionalBoolean("catalog") ?? false, 
                apis: config.getOptionalBoolean("apis") ?? false, 
                resources: config.getOptionalBoolean("resources") ?? false,
                create: config.getOptionalBoolean("create") ?? false, 
                docs: config.getOptionalBoolean("docs") ?? false, 
                groups: config.getOptionalBoolean("groups") ?? false,
                apiManagement: config.getOptionalBoolean("apiManagement") ?? false,
                signOut: true
            }
    }
}