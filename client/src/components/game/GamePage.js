import React, { useState, useEffect } from "react";
import queryString from "query-string";
import StartAudioContext from "startaudiocontext";
import Tone from "tone";
import io from "socket.io-client";

import "./Chat.css";
import Game from "./Game/Game.js";
import Input from "../input/Input.js";
import Messages from "../messages/Messages.js";
import Tempo from "../tempo/Tempo.js";

const ENDPOINT = "localhost:5000";
let socket = io(ENDPOINT);

const GamePage = ({ location }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [tempo, setTempo] = useState("0");
  const [click, setClick] = useState(0);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const name = queryString.parse(location.search);
    setName(name.name);

    socket.emit("join", name, e => {
      console.log(e);
    });

    socket.emit("subscribeToTimer", tempo => setTempo(tempo));

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [location.search]);

  useEffect(() => {
    // updates
    socket.on("message", message => {
      setMessages(messages => [...messages, message]);
    });

    socket.on("tempo", tempo => {
      setTempo(tempo);
    });
  }, []);

  const sendMessage = event => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  const sendTempo = event => {
    event.preventDefault();

    if (tempo) {
      socket.emit("tempoChange", tempo);
    }
  };

  const pushPreview = event => {
    socket.emit("previewPush");
  };

  return (
    <div className="outerContainer">
      <div className="left-container">
        <Game rows={28} cols={50} socket={socket} clickType={click} />
      </div>
      <div className="right-container">
        <div className="right-top-container">
          <Messages messages={messages} name={name} />
          <Input
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
        <div className="right-bottom-container">
          <div>
            <button
              className="preview "
              onClick={event => StartAudioContext(Tone.context)}
            >
              Start Sound
            </button>
          </div>
          <div className="tempo-text">Tempo</div>
          <div className="tempo-align">
            <Tempo tempo={tempo} setTempo={setTempo} sendTempo={sendTempo} />
          </div>
          <div>
            <button
              className="preview cell-button"
              onClick={event => setClick(0)}
            >
              cells
            </button>
            <button
              className="cell push-button"
              onClick={event => pushPreview()}
            >
              push changes
            </button>
          </div>
          <div className="button-layers">
            <div>
              <button
                className="synth-button note-button"
                onClick={event => setClick(1)}
              >
                Synth
              </button>
            </div>
            <div>
              <button
                className="amsynth-button note-button"
                onClick={event => setClick(2)}
              >
                AMSynth
              </button>
            </div>
            <div>
              <button
                className="fmsynth-button note-button"
                onClick={event => setClick(3)}
              >
                FMSynth
              </button>
            </div>
            <div>
              {/* <button className="mono" onClick={event => setClick(4)}>
              MonoSynth
            </button> */}
            </div>
            <div>
              <button
                className="duo-button note-button"
                onClick={event => setClick(5)}
              >
                DuoSynth
              </button>
            </div>
            <div>
              <button
                className="kick-button note-button"
                onClick={event => setClick(6)}
              >
                Bass/Kick
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
