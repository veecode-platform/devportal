import { createContext } from "react"


export type AppContextType = {
    showAlert: boolean,
    handleShowAlert: ()=>void,
    hasSupport: boolean
}

export const AppContext = createContext<AppContextType>(null!)