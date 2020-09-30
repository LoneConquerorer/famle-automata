# FaMLE;Automata

A multiplayer musical application of Conway's game of Life, a webapp created as a new take on sequencers. Composed for the MIT Laptop Ensemble.

Check it out here: https://loneconquerorer.github.io/famle-automata/


## How to play

1. Enter a username and click join to join the game.

2. There is a chat on the top right to talk to and coordinate between players.

3. There are two types of objects that can be placed: cells and notes. They can by applied by clicking/clicking and dragging.

For cells, after placing the desired pattern onto the board, they must be pushed to the server to begin evolution. They will evolve based on the tempo that is set for the game. The current rule is the classical Conway's Game of Life (B3/S23).

For notes, they are placed upon clicking.

4. When a cell is born ontop of a note block, that note is played. The board is tuned to a C major scale, increasing vertically. The sound is panned horizontally. The instruments are from Tone.js.

5. Music!

## Other details

### Known Known:

- Works in the Chrome browser (mine at least)

- Developed with React.js, Node.js, and Tone.js

### Known Unknown (bugs):

- When a lot of notes are being played each timestep, the audio may distort and cut out temporarily. If this persists, try clicking the starting audio button on the bottom right (multiple times if necessary). It might also be wise to clear the notes if there are just too many.

- When dragging to create notes or cells, clientside rendering may stutter or lag a bit. Haven't found a fix to that yet.

- Some sounds may be EQ'ed a bit wonk. Especially the bighter synths.

### Unknown Known (I guess it just works):

- ¯\_(ツ)\_/¯

### Unknown Unknown ():

- ¯\_(ツ)\_/¯

Updated May 25th, 2020
