const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const { addUser, removeUser, getUser } = require("./users.js");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

var tempo = 60;
var time = 0;

io.on("connection", socket => {
  console.log("player connected");
  // player side sockets
  socket.on("join", ({ name }, callback) => {
    const { error, user } = addUser({ id: socket.id, name });
    if (error) return callback(error);

    // Tells user they have joined
    socket.emit("message", {
      user: "admin",
      text: "You have joined the chat"
    });

    // Tells all other users that new user has joined
    socket.broadcast.emit("message", {
      user: "admin",
      text: `${user.name} has joined`
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const thisUser = getUser(socket.id);
    io.emit("message", { user: thisUser.name, text: message });
    callback();
  });

  // Game related sockets

  socket.on("subscribeToTimer", () => {
    setInterval(() => {
      io.sockets.emit("timer", time++);
    }, (60 / checkTempo()) * 1000);
  });

  socket.on("tempoChange", t => {
    console.log("client changed tempo to ", t);
    tempo = t;
    time = 0;
  });

  socket.on("disconnect", () => {
    console.log("player disconnected");
    const user = removeUser(socket.id);
    if (user) {
      io.emit("message", { user: "admin", text: `${user.name} has left` });
    }
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
