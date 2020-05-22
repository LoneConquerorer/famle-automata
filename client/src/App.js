import React from "react";
import "./App.css";
import Game from "./components/Game.js";

function App() {
  return (
    <div className="App">
      <Game rows={30} cols={50} />
    </div>
  );
}

export default App;
