const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const { addUser, removeUser, getUser } = require("./users.js");

const {
  addPreviewID,
  removePreviewID,
  addPreviewLoc,
  pushPreview,
  currentBoard,
  updateCells,
  addNoteLoc
} = require("./game.js");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

var tempo = 240;
var time = 0;

const checkTempo = () => {
  return tempo;
};

const updateStep = () => {
  console.log(time++);
  const { remove, cells } = updateCells();
  io.emit("cellsUpdate", { remove, cells });
  setTimeout(updateStep, (60 / checkTempo()) * 1000);
};

io.on("connection", socket => {
  console.log("player connected");
  // player side sockets
  socket.on("join", ({ name }, callback) => {
    const { error, user } = addUser({ id: socket.id, name });
    if (error) return callback(error);
    addPreviewID(socket.id);

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

  socket.on("boardInit", callback => {
    console.log("initializing board");
    callback(currentBoard());
  });

  socket.on("subscribeToTimer", callback => {
    callback(tempo);
    socket.emit("tempo", tempo);
  });

  socket.on("tempoChange", t => {
    console.log("client changed tempo to ", t);
    tempo = Math.max(30, parseInt(t));
    tempo = Math.min(tempo, 720);
    time = 0;
    io.emit("tempo", tempo);
  });

  socket.on("previewClick", ({ loc }) => {
    console.log("preview " + loc);
    addPreviewLoc(socket.id, loc);
    socket.broadcast.emit("previewUpdate", { loc });
  });

  // pushes the current preview
  socket.on("previewPush", () => {
    console.log("pushed!");
    pushPreview(socket.id);
  });

  socket.on("updateNotes", ({ loc, type }) => {
    addNoteLoc(loc, type);
    socket.broadcast.emit("notesUpdate", { loc, type });
  });

  socket.on("disconnect", () => {
    console.log("player disconnected");
    const user = removeUser(socket.id);
    const { arr } = removePreviewID(socket.id);
    if (user) {
      io.emit("message", { user: "admin", text: `${user.name} has left` });
    }

    // remove the preview of array
    io.emit("previewClose", { arr });
  });
});

updateStep();

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
