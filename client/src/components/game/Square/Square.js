import React from "react";
import "./Square.scss";

export default class Square extends React.Component {
  renderColor() {
    let c = "square ";
    if (this.props.preview) c += "preview ";
    if (this.props.cell) c += "cell ";
    if (this.props.note) c += "note";
    return <button className={c} onClick={this.props.onClick}></button>;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.preview !== this.props.preview) {
      return true;
    } else if (nextProps.cell !== this.props.cell) {
      return true;
    } else if (nextProps.note !== this.props.note) {
      return true;
    }
    return false;
  }

  render() {
    return <div className="squareContainer">{this.renderColor()}</div>;
  }
}
