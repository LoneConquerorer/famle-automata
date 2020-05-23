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
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const name = queryString.parse(location.search);
    setName(name.name);

    socket.emit("join", name, e => {
      console.log(e);
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [location.search]);

  useEffect(() => {
    socket.on("message", message => {
      setMessages(messages => [...messages, message]);
    });
  }, []);

  const sendMessage = event => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div className="outerContainer">
      <div className="left-container">
        <Game rows={30} cols={50} socket={socket} />
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
      </div>
    </div>
  );
};

export default GamePage;
