import React from "react";
import { Outlet, Switch } from "react-router-dom";

import Header from "./Header";
import RootRouter from "../RootRouter";

function Layout() {

  return (
    <>
      <Header />
      <div className="container">
        <Outlet />
        {/* <Switch>
          <RootRouter/>
        </Switch> */}
      </div>
    </>
  );
}

export default Layout;
