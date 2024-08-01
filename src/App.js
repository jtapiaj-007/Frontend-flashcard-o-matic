import React from "react";
import { Routes, Route, Switch } from "react-router-dom";

import Layout from "./Layout";
import "./App.css";
import RootRouter from "./RootRouter";

/**
 * App is a wrapper for <Layout>, you should not need to change this file.
 */

function App() {
  return (
    <div className="app-routes">
        <Layout />
        {/* <Switch>
          <Route path="/">
            <Layout />
          </Route>
        </Switch> */}
      </div>
  );
}

export default App;
