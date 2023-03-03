import React from "react";
import { useContext } from "react";
import EntityContext from "../../../context/EntityContext";

type Props = {
  annotation: string,
  children: any
}

export const ValidateComponent = ({ annotation, children }: Props) => {
  const { state } = useContext(EntityContext);
  const validate = (a: string) => {
    const data = state.metadata.annotations ?? '';
    if (data.hasOwnProperty(a)) return true;
    return false;
  }

  return (
    <>
      {
        !!validate(annotation) === true ? (
          children
        ) : null
      }
    </>
  )
} 