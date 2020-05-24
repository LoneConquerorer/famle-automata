import React, { useState, useEffect } from "react";
import queryString from "query-string";
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
  const [time, setTime] = useState("0");
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
        <Game rows={30} cols={50} socket={socket} clickType={click} />
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
            <div className="sentText">Time:{time}</div>
            <Input
              message={tempo}
              setMessage={setTempo}
              sendMessage={sendTempo}
            />
          </div>
          <div>
            <button className="cell" onClick={event => setClick(0)}>
              cells
            </button>
            <button className="push" onClick={event => pushPreview()}>
              push changes
            </button>
          </div>
          <div>
            <button className="cell" onClick={event => setClick(1)}>
              notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
