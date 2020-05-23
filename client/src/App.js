import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import GamePage from "./components/game/GamePage.js";
import Join from "./components/join/Join";

const App = () => (
  <Router>
    <Route path="/" exact component={Join} />
    <Route path="/game" component={GamePage} />
  </Router>
);

export default App;
