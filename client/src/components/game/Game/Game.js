import React from "react";
import Tone from "tone";
import Board from "../Board/Board.js";
import {
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
    Tone.Transport.start();
    Tone.Master.volume.value = -30;

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
      sounds: new Map(), // maps location to type
      octaves: Math.ceil(this.props.rows / 7),
      pitches: ["C", "D", "E", "F", "G", "A", "B"],
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
  }

  playNote(i, type) {
    if (Tone.Transport.state !== "started") {
      Tone.Transport.start();
      return;
    }
    if (Tone.context.state !== "running") {
      Tone.context.resume();
    }
    if (Tone.Transport.seconds < 1) return;

    const row = Math.floor(i / this.state.cols);
    const invert = this.state.rows - row - 1; // used for scale going up
    const octave = Math.floor(invert / this.state.pitches.length);
    const pitch = invert % this.state.pitches.length;
    console.log(this.state.pitches.length);
    console.log(i, row, invert, octave, pitch);
    let note = "";
    let duration = "";
    var inst = "";
    switch (type) {
      case 1: // synth
        inst = new Tone.Synth().toMaster();
        note = this.state.pitches[pitch] + (octave + 2).toString();
        duration = "4n";
        break;
      case 2: // AMsynth
        inst = new Tone.AMSynth().toMaster();
        note = this.state.pitches[pitch] + (octave + 2).toString();
        duration = "4n";
        break;
      case 3: // FMsynth
        inst = new Tone.FMSynth().toMaster();
        note = this.state.pitches[pitch] + (octave + 2).toString();
        duration = "4n";
        break;
      // case 4: // MonoSynth
      //   inst = new Tone.MonoSynth().toMaster();
      //   note = this.state.pitches[pitch] + (octave + 2).toString();
      //   duration = "4n";
      //   break;
      case 5: // DuoSynth
        inst = new Tone.DuoSynth().toMaster();
        note = this.state.pitches[pitch] + (octave + 2).toString();
        duration = "4n";
        break;
      case 6: // Bass/Kick
        inst = new Tone.MembraneSynth().toMaster();
        note = this.state.pitches[pitch] + octave.toString();
        duration = "1n";
        break;
      default:
        break;
    }
    if (note !== "" && duration !== "" && inst !== "") {
      console.log(note, duration);
      inst.triggerAttackRelease(note, duration);
    }
  }

  render() {
    if (this.props.tempo !== Tone.Transport.bpm) {
      Tone.Transport.bpm.value = this.props.tempo;
    }

    return (
      <div className="game">
        <div className="game-board-container">
          <Board
            preview={this.state.preview}
            cells={this.state.cells}
            notes={this.state.notes}
            onClick={i => this.handleClick(i)}
            playNote={(i, type) => this.playNote(i, type)}
            rows={this.state.rows}
            cols={this.state.cols}
          />
        </div>
      </div>
    );
  }
}
