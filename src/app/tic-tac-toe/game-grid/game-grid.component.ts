import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HumanPlayer, ComputerPlayer, player } from '../player/player';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-game-grid',
  templateUrl: './game-grid.component.html',
  styleUrls: ['./game-grid.component.css']
})
export class GameGridComponent implements OnInit {

  @Input() restart: Observable<any>;

  grid: Array<any> = [];
  humanPlayer: HumanPlayer;
  ComputerPlayer: ComputerPlayer;
  currentPlayer: player;
  humanLastMove: any;
  msg: any;
  winStatePaths = [
    [1, 4, 7],
    [3, 4, 5],
    [0, 4, 8],
    [6, 4, 2],
    [0, 1, 2],
    [0, 3, 6],
    [2, 5, 8],
    [6, 7, 8]
  ];
  gameFinished = false;

  constructor() {}

  initilizeGame(): void {
    this.initializeGrid();
      this.initializePlayer();
      this.msg = '';
      this.humanLastMove = undefined;
      this.gameFinished = false;
      this.startgame();
  }

  ngOnInit() {
    this.initilizeGame();
    this.restart.subscribe(() => {
      this.initilizeGame();
    });
  }

  initializeGrid(): void  {
    this.grid = [];
    for (let i = 0; i < 9; i++) {
      this.grid.push({id: i, value: ''});
    }
  }

  initializePlayer(): void {
    this.humanPlayer = new HumanPlayer('Suneel', 'X', <player>{});
    this.ComputerPlayer = new ComputerPlayer('O', this.humanPlayer);
    this.humanPlayer.opponent = this.ComputerPlayer;
  }

  startgame(): void {
    this.currentPlayer = this.humanPlayer;
  }

  selectCell(cell, _evt) {
    if (this.gameFinished || this.currentPlayer.name === 'Computer') {
      _evt.stopPropagation();
      return;
    }
    this.humanTurn(cell);
  }

  humanTurn(cell) {
    const gridCell = this.grid[cell.id];
    gridCell.value = this.currentPlayer.symbol;
    this.humanLastMove = gridCell;
    this.completePlayerTurn(this.currentPlayer);
  }

  computerTurn(): void {
    const gridCell = this.defensiveAlgo();
    gridCell.value =  this.currentPlayer.symbol;
    this.completePlayerTurn(this.currentPlayer);
  }

  defensiveAlgo() {
    const availableCells = this.grid.filter((item) => item.value === '');

    const rowPos = Math.trunc(this.humanLastMove.id / 3);
    const colPos = this.humanLastMove.id % 3;
    let rowCells = [], colCells = [];
    console.log(rowPos, colPos);
    for (let i = 0; i < 3; i++) {
      colCells.push(this.grid[(3 * i) + colPos]);
      rowCells.push(this.grid[(rowPos * 3) + i]);
    }
    if (rowPos === 2) {
      colCells.reverse();
    }

    if (colPos === 2) {
      rowCells.reverse();
    }

    let defensiveCells = [...colCells, ...rowCells];
    defensiveCells = defensiveCells.filter((item) => item.value === '');

    console.log(defensiveCells);

    if (defensiveCells.length > 0) {
      return defensiveCells[this.getRndInteger(0, defensiveCells.length - 1)];
    } else if (availableCells && availableCells.length > 0) {
      return availableCells[this.getRndInteger(0, availableCells.length - 1)];
    }
  }

  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  completePlayerTurn(currentPlayer: player): void {
    this.updateGameStatus(this.currentPlayer);

    if (this.currentPlayer.winner) {
      this.msg = `player ${this.currentPlayer.name} has won`;
      return;
    }

    if (!this.canGameContinue()) {
      this.msg = 'Game Draw';
      return;
    }

    this.currentPlayer = this.currentPlayer.opponent;

    if (this.currentPlayer.type === 'Computer') {
      this.computerTurn();
    }
  }

  updateGameStatus(currentPlayer: player): void {
    const symbol = currentPlayer.symbol;
    for (const winPath of this.winStatePaths) {
      if (this.grid[winPath[0]].value === symbol &&
          this.grid[winPath[1]].value === symbol &&
          this.grid[winPath[2]].value === symbol) {
            currentPlayer.winner = true;
            break;
      }
    }
    this.gameFinished = true;
    return;
  }

  canGameContinue(): boolean {
    const availableCells = this.grid.filter((item) => item.value === '');
    if (availableCells && availableCells.length > 0) {
      this.gameFinished = false;
      return true;
    }
    this.gameFinished = true;
    return false;
  }
}
