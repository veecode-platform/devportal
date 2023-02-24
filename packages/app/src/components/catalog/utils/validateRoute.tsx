import { EntityLayout } from "@backstage/plugin-catalog";
import React from "react";
import { useContext } from "react";
import EntityContext from "../../../context/EntityContext";

  type Props = {
    annotation:string,
    children:  any,
    path:string,
    title:string
  }

  export const ValidateRoute = ({path, title, annotation, children}: Props) => {
    const {state} = useContext(EntityContext);

    const validate = (a: string) => {
      const data = state.metadata.annotations ?? '';
      if (data.hasOwnProperty(a))  return true;
      return false;
    }
  
    return (
        <>
          { !!validate(annotation) === true ? (<EntityLayout.Route path={path as string} title={title as string}>
            {children}
          </EntityLayout.Route>): null}
        </>
    )    
  } 