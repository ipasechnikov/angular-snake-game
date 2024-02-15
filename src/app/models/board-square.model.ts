import { BoardSquareType } from "../enums/board-square-type.enum";

export interface BoardSquare {

  x: number;
  y: number;
  type: BoardSquareType;

}
