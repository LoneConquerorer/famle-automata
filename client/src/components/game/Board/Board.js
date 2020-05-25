import React from "react";
import Square from "../Square/Square.js";

export default class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        cell={this.props.cells[i]}
        preview={this.props.preview[i]}
        note={this.props.notes[i]}
        onClick={() => this.props.onClick(i)}
        playNote={type => this.props.playNote(i, type)}
      />
    );
  }

  render() {
    const rowCount = this.props.rows,
      colCount = this.props.cols;
    return (
      <div className="game-board">
        {[...new Array(rowCount)].map((x, rowIndex) => {
          return (
            <div className="board-row" key={rowIndex}>
              {[...new Array(colCount)].map((y, colIndex) =>
                this.renderSquare(rowIndex * colCount + colIndex)
              )}
            </div>
          );
        })}
      </div>
    );
  }
}
