import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Route, Routes} from 'react-router';
import { CredentialDetailsComponent } from "../CredentialDetailsComponent";
import { CredentialsListComponent } from "../CredentialListComponent";
import { NewCredentialComponent } from "../NewCredentialComponent";



export const CredentialsComponent = () => (
    <Routes>
        <Route path="/" element={<CredentialsListComponent/>} />  
        <Route path="/new-credential" element={<NewCredentialComponent/>}/>   
        <Route path="/details" element={<CredentialDetailsComponent/>}/>
    </Routes>
  );