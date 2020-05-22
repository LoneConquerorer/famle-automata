import React from "react";
import Square from "./Square.js";

export default class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const rowCount = this.props.rows,
      colCount = this.props.cols;
    return (
      <div>
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