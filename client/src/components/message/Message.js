import React from "react";
import "./Message.css";

const Message = ({ message: { user, text }, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyStart">
      <div className="nameBox">
        <p className="colorWhite">{trimmedName}:</p>
      </div>
      <div className="messageBox backgroundPurple">
        <p className="messageText colorWhite">{text}</p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="nameBox">
        <p className="colorWhite">{user}:</p>
      </div>
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{text}</p>
      </div>
    </div>
  );
};

export default Message;
