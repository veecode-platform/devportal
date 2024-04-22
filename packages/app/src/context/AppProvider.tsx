import React,{ ReactNode, useState } from "react";
import { AppContext } from "./AppContext";

interface AppProviderProps {
    children: ReactNode
};

export const AppProvider:React.FC<AppProviderProps> = ({children})=> {
    const [showAlert, setShowAlert] = useState<boolean>(true); // the status will be handled by a license validator - TO DO

    const handleShowAlert = ()=>
      setShowAlert(false)

    return (
        <AppContext.Provider
         value={{
            showAlert: showAlert,
            handleShowAlert: handleShowAlert
         }}
         >
            {children}
        </AppContext.Provider>
    )
}