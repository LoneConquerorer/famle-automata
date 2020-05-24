const rows = 30;
const cols = 50;
var preview = new Map();
var temp = Array();
var cells = Array(rows).fill(Array(cols).fill(0));
var notes = Array(rows).fill(Array(cols).fill(0));
var born = new Set([3]);
var survive = new Set([2, 3]);

// preview setup
const addPreviewID = id => {
  preview.set(id, Array(0));
  return;
};

const removePreviewID = id => {
  let arr = preview.get(id);
  preview.delete(id);
  return { arr };
};

// adds a location to the temporary array
const addPreviewLoc = (id, loc) => {
  const arr = preview.get(id);
  if (arr) {
    preview.set(id, arr.concat(loc));
  }
};

// pushes a player's preview to a temporary array
const pushPreview = id => {
  const arr = preview.get(id);
  temp = temp.concat(arr);
  preview.set(id, Array());
};

// returns the current board. Used for initial update.
const currentBoard = () => {
  let preview_arr = new Array(rows * cols);
  for (let value of preview.values()) {
    for (let i = 0; i < value.length; i++) {
      preview_arr[value[i]] = preview_arr[value[i]] ? 0 : 1;
    }
  }

  var cell_arr = new Array(rows * cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      cell_arr[i * cols + j] = cells[i][j];
    }
  }

  var notes_arr = new Array();
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      notes_arr[i * cols + j] = notes[i][j];
    }
  }

  return { preview: preview_arr, cells: cell_arr, notes: notes_arr };
};

// calculate next timestep of game, returns
const updateCells = () => {
  // adds temp cells (pushed preview cells)
  for (let x = 0; x < temp.length; x++) {
    const row = Math.floor(temp[x] / cols);
    const col = temp[x] % cols;
    var temp_row = cells[row].slice();
    temp_row[col] = temp_row[col] === 1 ? 0 : 1;
    cells[row] = temp_row;
  }
  const temp_arr = temp.slice();
  temp = new Array();

  // Calculates next step
  var newmatrix = [];
  for (var i = 0; i < rows; i++) {
    newmatrix[i] = [];
    for (var j = 0; j < cols; j++) {
      var total = 0;
      let im = i - 1 < 0 ? rows - 1 : i - 1;
      let ip = i + 1 >= rows ? 0 : i + 1;
      let jm = j - 1 < 0 ? cols - 1 : j - 1;
      let jp = j + 1 >= cols ? 0 : j + 1;

      total += cells[im][jm] ? cells[im][jm] : 0;
      total += cells[im][j] ? cells[im][j] : 0;
      total += cells[im][jp] ? cells[im][jp] : 0;

      total += cells[i][jm] ? cells[i][jm] : 0;
      total += cells[i][jp] ? cells[i][jp] : 0;

      total += cells[ip][jm] ? cells[ip][jm] : 0;
      total += cells[ip][j] ? cells[ip][j] : 0;
      total += cells[ip][jp] ? cells[ip][jp] : 0;

      if (cells[i][j]) {
        if (survive.has(total)) {
          newmatrix[i][j] = 1;
        } else {
          newmatrix[i][j] = 0;
        }
      } else if (!cells[i][j] && born.has(total)) {
        newmatrix[i][j] = 1;
      } else {
        newmatrix[i][j] = cells[i][j];
      }
    }
  }

  // updates cell matrix
  cells = newmatrix;

  // prep format for cell array
  var cell_arr = new Array();
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      cell_arr[i * cols + j] = cells[i][j];
    }
  }

  return { remove: temp_arr, cells: cell_arr };
};

// notes
const addNoteLoc = (loc, type) => {
  const row = Math.floor(loc / cols);
  const col = loc % cols;
  var temp = notes[row].slice();
  temp[col] = temp[col] === type ? 0 : type;
  notes[row] = temp;
  console.log(loc, notes[row][col], type);
  console.log(loc, notes[row][col - 1], type);
  console.log(loc, notes[row][col + 1], type);
};

module.exports = {
  addPreviewID,
  removePreviewID,
  addPreviewLoc,
  pushPreview,
  currentBoard,
  updateCells,
  addNoteLoc
};
