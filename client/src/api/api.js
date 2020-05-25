export function subscribeToTimer(socket, cb) {
  socket.emit("subscribeToTimer");
}

export function changeTempo(socket, tempo) {
  socket.emit("tempoChange", tempo);
}

export function initBoard(socket, cb) {
  socket.emit("boardInit", cb);
}

export function previewClick(socket, { loc, value }) {
  socket.emit("previewClick", { loc, value });
}

// sends note updates
export function updateNotes(socket, { loc, type, value }) {
  socket.emit("updateNotes", { loc, type, value });
}

// gets preview updates
export function tempoUpdate(socket, cb) {
  socket.on("tempo", t => cb(t));
}

// gets preview updates
export function previewUpdate(socket, cb) {
  socket.on("previewUpdate", ({ loc, value }) => cb(loc, value));
}

// gets note updates
export function notesUpdate(socket, cb) {
  socket.on("notesUpdate", ({ loc, type, value }) => cb(loc, type, value));
}

//gets cell updates
export function cellsUpdate(socket, cb) {
  socket.on("cellsUpdate", ({ remove, cells }) => cb(remove, cells));
}

export function previewClose(socket, cb) {
  socket.on("previewClose", ({ arr }) => cb(arr));
}

// clears all notes
export function notesCleared(socket, cb) {
  socket.on("notesCleared", () => cb());
}

// clears all cells
export function cellsCleared(socket, cb) {
  socket.on("cellsCleared", () => cb());
}
