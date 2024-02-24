import { Inject, Injectable } from '@angular/core';
import { CONTROLS_SERVICE_TOKEN, ControlsService } from './controls/controls.service';
import { BoardService } from './game-objects/board.service';
import { FoodService } from './game-objects/food.service';
import { GameObjectService } from './game-objects/game-object.service';
import { SnakeService } from './game-objects/snake.service';

@Injectable({
  providedIn: 'root'
})
export class GameLoopService {

  private readonly gameObjects: GameObjectService[] = [];
  private lastFrameTime: number = 0;

  constructor(
    boardService: BoardService,
    snakeService: SnakeService,
    foodService: FoodService,
    @Inject(CONTROLS_SERVICE_TOKEN) controlService: ControlsService,
  ) {
    this.gameObjects.push(
      boardService,
      snakeService,
      foodService,
      controlService,
    );
  }

  init(): void {
    for (const gameObject of this.gameObjects) {
      gameObject.init();
    }
  }

  start(): void {
    this.lastFrameTime = performance.now();
    this.gameLoop(this.lastFrameTime);
  }

  private gameLoop(timestamp: number): void {
    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    this.update(deltaTime);

    requestAnimationFrame(t => this.gameLoop(t))
  }

  private update(deltaTime: number): void {
    for (const gameObject of this.gameObjects) {
      gameObject.update(deltaTime);
    }
  }

}
