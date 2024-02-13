import { Injectable } from '@angular/core';
import { BoardService } from './board.service';
import { ControlsService } from './controls.service';
import { GameObjectService } from './game-object.service';
import { SnakeService } from './snake.service';

@Injectable({
  providedIn: 'root'
})
export class GameLoopService {

  private readonly gameObjects: GameObjectService[] = [];
  private lastFrameTime: number = 0;

  constructor(
    boardService: BoardService,
    snakeService: SnakeService,
    controlService: ControlsService,
  ) {
    this.gameObjects.push(
      boardService,
      snakeService,
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
