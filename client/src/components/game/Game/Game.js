import React from "react";
import Tone from "tone";
import Board from "../Board/Board.js";
import {
  initBoard,
  previewClick,
  updateNotes,
  tempoUpdate,
  previewUpdate,
  notesUpdate,
  cellsUpdate,
  previewClose,
  notesCleared,
  cellsCleared
} from "../../../api/api.js";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    Tone.Transport.start();
    Tone.Master.volume.value = -30;

    initBoard(this.props.socket, ({ preview, cells, notes }) =>
      this.setState({ preview, cells, notes })
    );

    tempoUpdate(this.props.socket, t => {
      Tone.Transport.bpm.value = t;
    });

    previewUpdate(this.props.socket, (loc, value) => {
      let temp = this.state.preview.slice();
      temp[loc] = value;

      this.setState({ preview: temp });
    });

    notesUpdate(this.props.socket, (loc, type, value) => {
      let temp = this.state.notes.slice();
      if (temp[loc] === type) {
        temp[loc] = value;
      } else {
        temp[loc] = value ? value : temp[loc];
      }
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

    notesCleared(this.props.socket, () => {
      this.setState({
        notes: Array(this.props.rows * this.props.cols).fill(0)
      });
    });

    cellsCleared(this.props.socket, () => {
      this.setState({
        cells: Array(this.props.rows * this.props.cols).fill(0)
      });
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
      sounds: new Map(), // maps location to type
      octaves: Math.ceil(this.props.rows / 7),
      pitches: ["C", "D", "E", "F", "G", "A", "B"],
      mouseClicked: false,
      mouseValue: null,
      timestamp: 0
    };
  }

  handleToggle(i, mouseStatus, updateValue) {
    const click = this.props.clickType;

    if (click === 0) {
      // click is a cell click; send to preview

      let temp = this.state.preview;
      if (updateValue) {
        temp[i] = temp[i] ? 0 : 1;
        this.setState({
          preview: temp,
          mouseClicked: mouseStatus,
          mouseValue: temp[i]
        });
      } else {
        temp[i] = this.state.mouseValue;
        this.setState({
          preview: temp,
          mouseClicked: mouseStatus
        });
      }
      previewClick(this.props.socket, { loc: i, value: temp[i] });
    } else {
      // click is a note click; send to notes

      let temp = this.state.notes.slice();
      if (updateValue) {
        temp[i] = temp[i] === click ? 0 : click;
        this.setState({
          notes: temp,
          mouseClicked: mouseStatus,
          mouseValue: temp[i]
        });
      } else {
        if (temp[i] === click) {
          temp[i] = this.state.mouseValue;
        } else {
          temp[i] = this.state.mouseValue ? this.state.mouseValue : temp[i];
        }
        this.setState({
          notes: temp,
          mouseClicked: mouseStatus
        });
      }
      updateNotes(this.props.socket, { loc: i, type: click, value: temp[i] });
    }
  }

  handleClick(i) {
    this.handleToggle(i, false, false);
  }

  handleMouseDown(i) {
    this.handleToggle(i, true, true);
    // console.log(this.state.mouseClicked);
  }

  handleMouseEnter(i) {
    if (this.state.mouseClicked) {
      this.handleToggle(i, true, false);
    }
    // console.log(this.state.mouseClicked);
  }

  handleMouseUpContext() {
    this.setState({ mouseClicked: false, mouseValue: null });
    // console.log(this.state.mouseClicked);
  }

  playNote(i, type) {
    if (Tone.Transport.state !== "started") {
      Tone.Transport.start();
      return;
    }
    if (Tone.context.state !== "running") {
      Tone.context.resume();
    }
    if (Tone.Transport.seconds < 2) return;
    // if (this.props.tempo !== Tone.Transport.bpm) {
    //   Tone.Transport.bpm.value = this.props.tempo;
    // }
    const row = Math.floor(i / this.state.cols);
    const col = i % this.state.cols;
    const invert = this.state.rows - row - 1; // used for scale going up
    const octave = Math.floor(invert / this.state.pitches.length);
    const pitch = invert % this.state.pitches.length;
    // console.log(this.state.pitches.length);
    // console.log(i, row, invert, octave, pitch);
    let note = "";
    let duration = "4n";
    var inst = "";
    const panVol = new Tone.PanVol();
    panVol.pan.value = col * (2 / (this.state.cols - 1)) - 1;

    switch (type) {
      case 1: // synth
        inst = new Tone.Synth();
        note = this.state.pitches[pitch] + (octave + 2).toString();
        duration = "4n";
        break;
      case 2: // AMsynth
        inst = new Tone.AMSynth();
        note = this.state.pitches[pitch] + (octave + 2).toString();
        duration = "4n";
        break;
      case 3: // FMsynth
        inst = new Tone.FMSynth();
        note = this.state.pitches[pitch] + (octave + 2).toString();
        duration = "4n";
        break;
      // case 4: // MonoSynth
      //   inst = new Tone.MonoSynth().toMaster();
      //   note = this.state.pitches[pitch] + (octave + 2).toString();
      //   duration = "4n";
      //   break;
      case 5: // DuoSynth
        inst = new Tone.DuoSynth();
        note = this.state.pitches[pitch] + (octave + 2).toString();
        duration = "4n";
        break;
      case 6: // Bass/Kick
        inst = new Tone.MembraneSynth();
        note = this.state.pitches[pitch] + octave.toString();
        duration = "1n";
        break;
      default:
        break;
    }

    if (note !== "" && duration !== "" && inst !== "") {
      // console.log(note, duration);
      inst.chain(panVol, Tone.Master);
      inst.triggerAttackRelease(note, duration);
    }
  }

  render() {
    return (
      <div className="game">
        <div className="game-board-container">
          <Board
            preview={this.state.preview}
            cells={this.state.cells}
            notes={this.state.notes}
            onClick={i => this.handleClick(i)}
            mouseDown={i => this.handleMouseDown(i)}
            mouseEnter={i => this.handleMouseEnter(i)}
            mouseUpContext={() => this.handleMouseUpContext()}
            playNote={(i, type) => this.playNote(i, type)}
            rows={this.state.rows}
            cols={this.state.cols}
          />
        </div>
      </div>
    );
  }
}
