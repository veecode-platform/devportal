import React from 'react';
import { createContext, useState } from "react";
import { Entity } from '@backstage/catalog-model';

type PropsEntityContext = {
    state: Entity,
    setState: React.Dispatch<React.SetStateAction<Entity>>;
};
  
const DEFAULT_VALUE = {
    state: {
        apiVersion: "",
        kind: '',
        metadata: {name:""}
    },
    setState: () => {}
}

const EntityContext = createContext<PropsEntityContext>(DEFAULT_VALUE);
  
export const EntityContextProvider : React.FC = ({children}) => {
    const [state, setState] = useState(DEFAULT_VALUE.state);
    return (
        <EntityContext.Provider
         value={{
            state,
            setState
         }}
         >
            {children}
        </EntityContext.Provider>
    )
}

export default EntityContext;

