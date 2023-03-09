import React, { Fragment } from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom'
//components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
      
    </Fragment>
  );
}

export default App;