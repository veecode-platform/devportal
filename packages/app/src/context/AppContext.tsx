import { createContext } from "react"


export type AppContextType = {
    showAlert: boolean,
    handleShowAlert: ()=>void
}

export const AppContext = createContext<AppContextType>(null!)