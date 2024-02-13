import { BoardSquareType } from "../enums/board-square-type.enum";
import { BoardSquare } from "./board-square.model";

export class Board {

  readonly squares: BoardSquare[][] = [];

  constructor(readonly width: number, readonly height: number) {
    this.initSquares(width, height);
  }

  private initSquares(width: number, height: number): void {
    for (let y = 0; y < height; y++) {
      this.squares[y] = [];
      for (let x = 0; x < width; x++) {
        this.squares[y][x] = this.createSquare();
      }
    }
  }

  private createSquare(): BoardSquare {
    return {
      type: BoardSquareType.Empty,
    };
  }

}
