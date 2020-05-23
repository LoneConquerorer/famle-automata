export function subscribeToTimer(socket, cb) {
  socket.on("timer", timestamp => cb(null, timestamp));
  socket.emit("subscribeToTimer");
}

export function changeTempo(socket) {
  socket.emit("tempoChange", 600);
}
