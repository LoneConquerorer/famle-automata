export function subscribeToTimer(socket, cb) {
  socket.emit("subscribeToTimer");
}

export function changeTempo(socket, tempo) {
  socket.emit("tempoChange", tempo);
}

export function initBoard(socket, cb) {
  socket.emit("boardInit", cb);
}

export function previewClick(socket, loc) {
  socket.emit("previewClick", { loc });
}

// sends note updates
export function updateNotes(socket, { loc, type }) {
  socket.emit("updateNotes", { loc, type });
}

// gets preview updates
export function previewUpdate(socket, cb) {
  socket.on("previewUpdate", ({ loc }) => cb(loc));
}

// gets note updates
export function notesUpdate(socket, cb) {
  socket.on("notesUpdate", ({ loc, type }) => cb(loc, type));
}

//gets cell updates
export function cellsUpdate(socket, cb) {
  socket.on("cellsUpdate", ({ remove, cells }) => cb(remove, cells));
}

export function previewClose(socket, cb) {
  socket.on("previewClose", ({ arr }) => cb(arr));
}
