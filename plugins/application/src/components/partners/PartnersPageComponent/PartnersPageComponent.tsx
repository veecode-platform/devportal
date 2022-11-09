import React from "react";
import { Route, Routes} from 'react-router';
import { ListComponent } from "../ListComponent";
import { DetailsComponent } from "../DetailsComponent";
import { CreateComponent } from "../CreateComponent";


export const PartnersPageComponent = () => (
    <Routes>
        <Route path="/" element={<ListComponent/>} />     
        <Route path="/partner-details" element={<DetailsComponent/>} />
        <Route path="/create-partner" element={<CreateComponent/>}/>
    </Routes>        
  );