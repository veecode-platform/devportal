//import React from 'react';
import { usePermissionsCheck } from '../../Hooks/permissions';

const RenderItem = ({allow, children}: any) => {

  const user = usePermissionsCheck();

  return (
    allow.includes(user.toString()) ? children : null
  )

}
 
export default RenderItem
    









