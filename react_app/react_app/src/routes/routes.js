//This is the starting point of the application

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../component/app.component';
import AppTwo from '../component/app.componenttwo';
import About from '../AboutUs/about';
import "../css/main.css";    // importing 'main.css' file which contains all the
                             // css of the application.

export default () => {
 return (
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route exact path="/comtwo" element={<AppTwo />} />
      <Route exact path="/about" element={<About />} />
    </Routes>
  </BrowserRouter>    
 )
}