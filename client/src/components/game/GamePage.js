import React, { useState, useEffect } from "react";
import queryString from "query-string";
import StartAudioContext from "startaudiocontext";
import Tone from "tone";
import io from "socket.io-client";

import "./Chat.css";
import Game from "./Game/Game.js";
import Input from "../input/Input.js";
import Messages from "../messages/Messages.js";

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
      socket.emit("tempoChange", tempo, () => setTempo(tempo));
    }
  };

  const pushPreview = event => {
    socket.emit("previewPush");
  };

  return (
    <div className="outerContainer">
      <div className="left-container">
        <Game
          rows={28}
          cols={50}
          socket={socket}
          clickType={click}
          tempo={tempo}
        />
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
            <div className="sentText">Time:{0}</div>
            <button
              className="preview"
              onClick={event => StartAudioContext(Tone.context)}
            >
              Start Sound
            </button>
            <Input
              message={tempo}
              setMessage={setTempo}
              sendMessage={sendTempo}
            />
          </div>
          <div>
            <button className="preview" onClick={event => setClick(0)}>
              cells
            </button>
            <button className="push" onClick={event => pushPreview()}>
              push changes
            </button>
          </div>
          <div>
            <button className="synth" onClick={event => setClick(1)}>
              Synth
            </button>
            <button className="amsynth" onClick={event => setClick(2)}>
              AMSynth
            </button>
            <button className="fmsynth" onClick={event => setClick(3)}>
              FMSynth
            </button>
            {/* <button className="mono" onClick={event => setClick(4)}>
              MonoSynth
            </button> */}
            <button className="duo" onClick={event => setClick(5)}>
              DuoSynth
            </button>
            <button className="kick" onClick={event => setClick(6)}>
              Bass/Kick
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
