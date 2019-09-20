import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { EventEmitter, Subject } from '@angular/forms/src/facade/async';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent implements OnInit, OnDestroy {
  private eventSubject: Subject<any> = new Subject<any>();

  constructor() { }

  ngOnInit() {
  }

  resetGame(): void {
    this.eventSubject.next();
  }

  ngOnDestroy() {
    this.eventSubject.unsubscribe();
  }
}
