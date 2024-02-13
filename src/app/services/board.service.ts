import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { BoardSquareType } from '../enums/board-square-type.enum';
import { BoardSquare } from '../models/board-square.model';
import { Board } from '../models/board.model';
import { GameObjectService } from './game-object.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService implements GameObjectService {

  public readonly boardWidth: number = 32;
  public readonly boardHeight: number = 32;

  private readonly board: Board = new Board(this.boardWidth, this.boardHeight);
  private readonly boardSquareRedrawQueue: BoardSquare[] = [];
  private readonly boardSquareRedrawSubjects: Map<BoardSquare, Subject<void>> = new Map<BoardSquare, Subject<void>>();

  constructor() { }

  init(): void {
    for (const boardRow of this.board.squares) {
      for (const boardSquare of boardRow) {
        this.boardSquareRedrawSubjects.set(boardSquare, new Subject<void>());
      }
    }
  }

  update(deltaTime: number): void {
    this.redrawBoardSquares();
  }

  getBoardRows(): BoardSquare[][] {
    return this.board.squares;
  }

  getSquareRedrawEvents(boardSquare: BoardSquare): Observable<void> {
    return this.boardSquareRedrawSubjects.get(boardSquare)?.asObservable() ?? of();
  }

  setSquareType(x: number, y: number, type: BoardSquareType): void {
    const boardSquare = this.board.squares[y][x];
    boardSquare.type = type;
    this.addToRedrawQueue(boardSquare);
  }

  private addToRedrawQueue(boardSquare: BoardSquare): void {
    this.boardSquareRedrawQueue.push(boardSquare);
  }

  private clearRedrawQueue(): void {
    this.boardSquareRedrawQueue.length = 0;
  }

  private redrawBoardSquares(): void {
    if (this.boardSquareRedrawQueue.length === 0) {
      return;
    }

    for (const boardSquare of this.boardSquareRedrawQueue) {
      this.redrawBoardSquare(boardSquare);
    }
    this.clearRedrawQueue();
  }

  private redrawBoardSquare(boardSquare: BoardSquare): void {
    const redrawBoardSquareSubject = this.boardSquareRedrawSubjects.get(boardSquare);
    if (redrawBoardSquareSubject !== undefined) {
      redrawBoardSquareSubject.next();
    }
  }

}
