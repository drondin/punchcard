import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Punchcard from "./Punchcard";
import Wallet from "./Wallet";

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Punchcard />
          </Route>
          <Route path="/wallet">
            <Wallet />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}