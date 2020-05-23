import React from "react";
import Board from "./Board.js";
import { subscribeToTimer, changeTempo } from "../../api/api.js";
// import io from "socket.io-client";

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    subscribeToTimer(this.props.socket, (err, timestamp) =>
      this.setState({
        timestamp
      })
    );

    this.state = {
      xIsNext: true,
      stepNumber: 0,
      rows: this.props.rows,
      cols: this.props.cols,
      socket: this.props.socket,
      history: [
        {
          squares: Array(this.props.rows * this.props.cols).fill(null)
        }
      ],
      timestamp: 0
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board-container">
          <Board
            squares={current.squares}
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

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
