import { createBackendModule } from '@backstage/backend-plugin-api';
import {
    //GroupTransformer,
    keycloakTransformerExtensionPoint,
    UserTransformer,
  } from '@backstage-community/plugin-catalog-backend-module-keycloak';
  
  /*const customGroupTransformer: GroupTransformer = async (
    entity,
    realm,
    groups,
  ) => {
    //console.log("Group Transformer: ", entity, realm, groups)
    return entity;
  };*/
  const customUserTransformer: UserTransformer = async (
    entity,
    _user,
    _realm,
    _groups,
  ) => {
    const modifiedEntity = {
        ...entity,
        metadata: {
            name: entity.metadata.name.split("@")[0],
            annotations: entity.metadata.annotations
        }

    }
    return modifiedEntity
  };

  
  export const keycloakBackendModuleTransformer = createBackendModule({
    pluginId: 'catalog',
    moduleId: 'keycloak-transformer',
    register(reg) {
      reg.registerInit({
        deps: {
          
          keycloak: keycloakTransformerExtensionPoint,
          
        },
        
        async init({ keycloak }) {
          keycloak.setUserTransformer(customUserTransformer);
          
        },
      });
    },
  });