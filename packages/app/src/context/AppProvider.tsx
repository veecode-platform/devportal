import React,{ ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import { licenseKeyApiRef } from "@internal/backstage-plugin-support"
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';


interface AppProviderProps {
    children: ReactNode
};

export const AppProvider:React.FC<AppProviderProps> = ({children})=> {
    const licenseKeyApi = useApi(licenseKeyApiRef);
    const [showAlert, setShowAlert] = useState<boolean>(false); 

    const { value } = useAsync(async (): Promise<any> => {
        const license = await licenseKeyApi.validateLicenseKey()
        return license
      }, []);

    useEffect(()=> {
      setShowAlert(!value?.valid_key)
    }, [value])

    const handleShowAlert = useCallback(()=>setShowAlert(false),[showAlert])

    return (
        <AppContext.Provider
         value={{
            showAlert: showAlert,
            handleShowAlert: handleShowAlert,
            hasSupport: !value?.valid_key ?? false
         }}
         >
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);