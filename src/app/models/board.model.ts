import { BoardSquareType } from "../enums/board-square-type.enum";
import { BoardSquare } from "./board-square.model";

export class Board {

  private readonly squares: BoardSquare[][] = [];

  constructor(readonly width: number, readonly height: number) {
    this.createSquares(width, height);
  }

  getRows(): BoardSquare[][] {
    return this.squares;
  }

  getSquare(x: number, y: number): BoardSquare {
    return this.squares[y][x];
  }

  private createSquares(width: number, height: number): void {
    for (let y = 0; y < height; y++) {
      this.squares[y] = [];
      for (let x = 0; x < width; x++) {
        this.squares[y][x] = this.createSquare(x, y);
      }
    }
  }

  private createSquare(x: number, y: number): BoardSquare {
    return {
      x, y,
      type: BoardSquareType.Empty,
    };
  }

}
