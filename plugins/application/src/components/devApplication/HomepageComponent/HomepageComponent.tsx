import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Route, Routes} from 'react-router';
import { ApplicationDetailsComponent } from "../ApplicationDetailsComponent";
import { ApplicationListComponent } from "../ApplicationListComponent";
import { NewApplicationComponent } from "../NewApplicationComponent";

export const HomePageComponent = () => (
    <Routes>
        <Route path="/" element={<ApplicationListComponent/>} />     
        <Route path="/details" element={<ApplicationDetailsComponent/>} />
        <Route path="/new-app" element={<NewApplicationComponent/>} />
    </Routes>
  );