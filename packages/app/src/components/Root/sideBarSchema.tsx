import { ConfigApi } from "@backstage/core-plugin-api"

export type sidebarDefaultType = {
    home: boolean,
    catalog: boolean, 
    apis: boolean, 
    create: boolean, 
    docs: boolean, 
    groups: boolean,
    apiManagement: boolean
}

const sideBarDefaultValues: sidebarDefaultType = {  
    home: true,
    catalog: true, 
    apis: true, 
    create: true, 
    docs: true, 
    groups: false,
    apiManagement: false
}

const sideBarProduct: sidebarDefaultType = {
    ...sideBarDefaultValues,
    groups: true,
    apiManagement: true
}

const sideBarDemo: sidebarDefaultType = {
    ...sideBarDefaultValues
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
                home: config.getBoolean("home"),
                catalog: config.getBoolean("catalog"), 
                apis: config.getBoolean("apis"), 
                create: config.getBoolean("create"), 
                docs: config.getBoolean("docs"), 
                groups: config.getBoolean("groups"),
                apiManagement: config.getBoolean("apiManagement")
            }
    }
}