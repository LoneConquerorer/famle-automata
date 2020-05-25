import React from "react";
import "./Square.scss";

export default class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      instruments: [
        "",
        "synth ",
        "amsynth ",
        "fmsynth ",
        "mono ",
        "duo ",
        "kick "
      ]
    };
  }
  renderColor() {
    let c = "square ";
    if (this.props.preview) c += "preview ";
    if (this.props.cell) c += "cell ";
    if (this.props.note) c += this.state.instruments[this.props.note];

    return (
      <button
        className={c}
        onClick={this.props.onClick}
        onMouseDown={this.props.mouseDown}
        onMouseEnter={this.props.mouseEnter}
        onMouseUp={this.props.mouseUpContext}
        onContextMenu={this.props.mouseUpContext}
      ></button>
    );
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
    if (this.props.note && this.props.cell) {
      this.props.playNote(this.props.note);
    }
    return <div className="squareContainer">{this.renderColor()}</div>;
  }
}
