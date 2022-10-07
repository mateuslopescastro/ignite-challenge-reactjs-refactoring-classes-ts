import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { GlobalStyles } from "./styles/global";
import { Routes } from "./routes";

export function App() {
  return (
    <>
      <GlobalStyles />

      <Router>
        <Routes />
      </Router>
    </>
  );
}
