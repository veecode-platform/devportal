import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { usePermissionsCheck } from '../../Hooks/permissions';

const SafeRoute = ({allow}: any) => {

  const user = usePermissionsCheck();

  return (
    allow.includes(user.toString()) ? <Outlet/> : <Navigate to="/" replace />
  )

}
 
export default SafeRoute
    
