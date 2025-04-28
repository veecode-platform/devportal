import type { Entity } from "@backstage/catalog-model";
import { ANNOTATION_LOCATION } from "../utils/contants/annotations";

export const useEntityAnnotation = (entity:Entity) => {

    if(!entity) return { 
        location: null,
        projectName: null,
    }
    
    const location = entity.metadata.annotations![ANNOTATION_LOCATION];
    const projectName = entity.metadata.name;

    return {
        location,
        projectName
    }
}