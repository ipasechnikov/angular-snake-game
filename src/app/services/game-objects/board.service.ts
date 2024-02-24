import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { BoardSquareType } from '../../enums/board-square-type.enum';
import { BoardSquare } from '../../models/board-square.model';
import { Board } from '../../models/board.model';
import { GameObjectService } from './game-object.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService implements GameObjectService {

  public readonly boardWidth: number = 32;
  public readonly boardHeight: number = 32;

  private readonly board: Board = new Board(this.boardWidth, this.boardHeight);
  private readonly boardSquareRedrawQueue: Map<number, BoardSquare> = new Map<number, BoardSquare>();
  private readonly boardSquareRedrawSubjects: Map<BoardSquare, Subject<void>> = new Map<BoardSquare, Subject<void>>();

  init(): void {
    for (const boardRow of this.board.getRows()) {
      for (const boardSquare of boardRow) {
        this.boardSquareRedrawSubjects.set(boardSquare, new Subject<void>());
      }
    }
  }

  update(deltaTime: number): void {
    this.redrawBoardSquares();
  }

  getRows(): BoardSquare[][] {
    return this.board.getRows();
  }

  getSquare(x: number, y: number): BoardSquare {
    return this.board.getSquare(x, y);
  }

  getSquareRedrawEvents(boardSquare: BoardSquare): Observable<void> {
    return this.boardSquareRedrawSubjects.get(boardSquare)?.asObservable() ?? of();
  }

  setSquareType(x: number, y: number, type: BoardSquareType): void {
    const oldBoardSquare = this.getSquare(x, y);
    const newBoardSquare = { ...oldBoardSquare, type };
    this.addToRedrawQueue(newBoardSquare);
  }

  private getSquareKey(boardSquare: BoardSquare): number {
    return boardSquare.y * this.boardWidth + boardSquare.x;
  }

  private addToRedrawQueue(boardSquare: BoardSquare): void {
    const boardSquareKey = this.getSquareKey(boardSquare);
    this.boardSquareRedrawQueue.set(boardSquareKey, boardSquare);
  }

  private clearRedrawQueue(): void {
    this.boardSquareRedrawQueue.clear();
  }

  private redrawBoardSquares(): void {
    if (this.boardSquareRedrawQueue.size === 0) {
      return;
    }

    for (const newBoardSquare of this.boardSquareRedrawQueue.values()) {
      const oldBoardSquare = this.getSquare(newBoardSquare.x, newBoardSquare.y);
      if (oldBoardSquare.type !== newBoardSquare.type) {
        oldBoardSquare.type = newBoardSquare.type;
        this.redrawBoardSquare(oldBoardSquare);
      }
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
