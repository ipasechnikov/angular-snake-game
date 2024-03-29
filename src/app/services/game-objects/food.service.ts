import { Injectable } from "@angular/core";
import { BoardSquareType } from "../../enums/board-square-type.enum";
import { BoardSquare } from "../../models/board-square.model";
import { randomInt } from "../../utils/random";
import { BoardService } from "./board.service";
import { GameObjectService } from "./game-object.service";

@Injectable({
  providedIn: 'root'
})
export class FoodService implements GameObjectService {

  private foodBoardSquare?: BoardSquare;

  constructor(
    private readonly boardService: BoardService,
  ) {
  }

  init(): void {
  }

  update(deltaTime: number): void {
    if (!this.hasFood()) {
      this.spawnFood();
    }
  }

  private spawnFood(): void {
    do {
      const foodBoardSquare = this.getRandomBoardSquare();
      if (foodBoardSquare.type === BoardSquareType.Empty) {
        this.foodBoardSquare = foodBoardSquare;
        this.boardService.setSquareType(
          this.foodBoardSquare.x,
          this.foodBoardSquare.y,
          BoardSquareType.Food
        );
      }
    } while (this.foodBoardSquare === undefined)
  }

  private getRandomBoardSquare(): BoardSquare {
    const x = randomInt(0, this.boardService.boardWidth);
    const y = randomInt(0, this.boardService.boardHeight);
    return this.boardService.getSquare(x, y);
  }

  private hasFood(): boolean {
    return this.foodBoardSquare !== undefined
      && this.foodBoardSquare.type === BoardSquareType.Food;
  }

}
