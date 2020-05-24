import React from "react";
import Board from "../Board/Board.js";
import {
  subscribeToTimer,
  changeTempo,
  initBoard,
  previewClick,
  updateNotes,
  previewUpdate,
  notesUpdate,
  cellsUpdate,
  previewClose
} from "../../../api/api.js";

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    initBoard(this.props.socket, ({ preview, cells, notes }) =>
      this.setState({ preview, cells, notes })
    );

    previewUpdate(this.props.socket, loc => {
      let temp = this.state.preview.slice();
      temp[loc] = temp[loc] === 1 ? 0 : 1;
      this.setState({ preview: temp });
    });

    notesUpdate(this.props.socket, (loc, type) => {
      let temp = this.state.notes.slice();
      temp[loc] = temp[loc] === type ? 0 : type;
      this.setState({ notes: temp });
    });

    cellsUpdate(this.props.socket, (remove, cells) => {
      let temp1 = this.state.preview.slice();
      for (let i = 0; i < remove.length; i++) {
        temp1[remove[i]] = 0;
      }
      this.setState({ cells: cells, preview: temp1 });
    });

    previewClose(this.props.socket, arr => {
      if (arr) {
        let temp = this.state.preview.slice();
        for (let i = 0; i < arr.length; i++) {
          temp[arr[i]] = 0;
        }
        this.setState({ preview: temp });
      }
    });

    this.state = {
      xIsNext: true,
      stepNumber: 0,
      rows: this.props.rows,
      cols: this.props.cols,
      socket: this.props.socket,
      preview: Array(this.props.rows * this.props.cols).fill(0),
      cells: Array(this.props.rows * this.props.cols).fill(0),
      notes: Array(this.props.rows * this.props.cols).fill(0),
      timestamp: 0
    };
  }

  handleClick(i) {
    const click = this.props.clickType;

    if (click === 0) {
      // click is a cell click; send to preview
      previewClick(this.props.socket, i);

      let temp = this.state.preview;
      temp[i] = temp[i] ? 0 : 1;
      this.setState({ preview: temp });
    } else {
      // click is a note click; send to notes
      updateNotes(this.props.socket, { loc: i, type: click });

      let temp = this.state.notes.slice();
      temp[i] = temp[i] === click ? 0 : click;
      this.setState({ notes: temp });
    }

    // const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // const current = history[history.length - 1];
    // const squares = current.squares.slice();
    // if (calculateWinner(squares) || squares[i]) {
    //   return;
    // }
    // squares[i] = this.state.xIsNext ? "X" : "O";
    // this.setState({
    //   history: history.concat([{ squares: squares }]),
    //   xIsNext: !this.state.xIsNext,
    //   stepNumber: history.length
    // });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    // const history = this.state.history;
    // const current = history[this.state.stepNumber];
    // const winner = calculateWinner(current.squares);

    // const moves = history.map((step, move) => {
    //   const desc = move ? "Go to move #" + move : "Go to game start";
    //   return (
    //     <li key={move}>
    //       <button onClick={() => this.jumpTo(move)}>{desc}</button>
    //     </li>
    //   );
    // });

    // let status;
    // if (winner) {
    //   status = "Winner: " + winner;
    // } else {
    //   status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    // }
    return (
      <div className="game">
        <div className="game-board-container">
          <Board
            preview={this.state.preview}
            cells={this.state.cells}
            notes={this.state.notes}
            onClick={i => this.handleClick(i)}
            rows={this.state.rows}
            cols={this.state.cols}
          />
        </div>
        {/* <div className="game-info">
          <button onClick={() => changeTempo(this.state.socket)}>
            change tempo to 120
          </button>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <p className="App-intro">
          This is the timer value: {this.state.timestamp}
        </p> */}
      </div>
    );
  }
}
