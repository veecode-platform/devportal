import React , {ReactElement, /* ReactNode*/} from 'react';
import { Navigate, Outlet, /* Route*/ } from 'react-router';
// import { useApp } from '@backstage/core-plugin-api';
import { usePermissionsCheck } from '../../Hooks/permissions';



type SafeRouteProps = {
  allow: Array<string>;
  children?: ReactElement;
}

const SafeRoute = ({allow}:SafeRouteProps) =>{
/*
  const app = useApp();

  const user = usePermissionsCheck();

  console.log(user)

  if(allow.includes(user as string)) return <>{children}</>
  const { NotFoundErrorPage } = app.getComponents();
  return <NotFoundErrorPage/>*/

  const user = usePermissionsCheck();
  return (
    allow.includes(user as string) ? <Outlet/> : <Navigate to="/" replace />
  )

}
 
export default SafeRoute

    
