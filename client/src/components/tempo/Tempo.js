import React from "react";
import "./Tempo.css";

const Tempo = ({ tempo, setTempo, sendTempo }) => (
  <form className="tempo-form">
    <input
      className="tempo"
      type="number"
      value={tempo}
      onChange={event => setTempo(event.target.value)}
      onKeyPress={event => (event.key === "Enter" ? sendTempo(event) : null)}
    />
    <button className="tempoButton" onClick={event => sendTempo(event)}>
      Set Tempo
    </button>
  </form>
);

export default Tempo;
