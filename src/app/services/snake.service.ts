import { Injectable, OnDestroy } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { BoardSquareType } from '../enums/board-square-type.enum';
import { ControlEvent } from '../enums/control-event.enum';
import { SnakeDirection } from '../enums/snake-direction.enum';
import { SnakePart } from '../models/snake-part.model';
import { Snake } from '../models/snake.model';
import { BoardService } from './board.service';
import { ControlsService } from './controls.service';
import { GameObjectService } from './game-object.service';

@Injectable({
  providedIn: 'root'
})
export class SnakeService implements GameObjectService, OnDestroy {

  private readonly defaultDirection = SnakeDirection.Up;
  private readonly defaultSpeed = 5;
  private readonly defaultLength = 3;
  private readonly snake: Snake = this.initSnake();

  private readonly isBodyCollisionEnabled: boolean = false;
  private readonly isWallCollisionEnabled: boolean = false;

  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  private timeElapsed: number = 0;
  private nextControlEvent?: ControlEvent;

  constructor(
    private readonly boardService: BoardService,
    private readonly controlsService: ControlsService,
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  init(): void {
    this.controlsService.controlEvents$.pipe(
      tap((controlEvent) => this.handleControlEvent(controlEvent)),
      takeUntil(this.unsubscribe$),
    ).subscribe();
  }

  update(deltaTime: number): void {
    this.eraseSnake();
    this.updateSnake(deltaTime);
    this.drawSnake();
  }

  private initSnake(): Snake {
    return {
      direction: this.defaultDirection,
      speed: this.defaultSpeed,
      parts: this.initSnakeParts(this.defaultLength),
    };
  }

  private initSnakeParts(length: number): SnakePart[] {
    const headX = Math.floor(this.boardService.boardWidth / 2) - 1;
    const headY = Math.floor(this.boardService.boardHeight / 2) - 1;
    const head: SnakePart = {
      x: headX,
      y: headY,
    };

    const parts: SnakePart[] = [head];
    for (let i = 1; i < length; i++) {
      const bodyPart: SnakePart = {
        x: headX,
        y: headY + i,
      };
      parts.push(bodyPart);
    }

    return parts;
  }

  private stepParts(): void {
    for (let i = this.snake.parts.length - 1; i >= 1; i--) {
      const tailPart = this.snake.parts[i];
      const prevPart = this.snake.parts[i - 1];
      tailPart.x = prevPart.x;
      tailPart.y = prevPart.y;
    }

    const headPart = this.snake.parts[0];
    switch (this.snake.direction) {
      case SnakeDirection.Up:
        headPart.y--;
        break;
      case SnakeDirection.Down:
        headPart.y++;
        break;
      case SnakeDirection.Left:
        headPart.x--;
        break;
      case SnakeDirection.Right:
        headPart.x++;
        break;
      default:
        throw new Error(`Unexpected direction value: ${this.snake.direction}`);
    }
  }

  private updateSnake(deltaTime: number): void {
    this.timeElapsed += deltaTime;
    const steps = Math.floor(this.snake.speed * this.timeElapsed / 1000);
    if (steps > 0) {
      this.timeElapsed = 0;
    }

    for (let i = 0; i < steps; i++) {
      this.handleControls();
      this.stepParts();
      this.detectCollisions();
    }
  }

  private eraseSnake(): void {
    for (const part of this.snake.parts) {
      this.boardService.setSquareType(part.x, part.y, BoardSquareType.Empty);
    }
  }

  private drawSnake(): void {
    const head = this.snake.parts[0];
    this.boardService.setSquareType(
      head.x, head.y, BoardSquareType.SnakeHead
    );

    const bodyParts = this.snake.parts.slice(1);
    for (const part of bodyParts) {
      this.boardService.setSquareType(
        part.x, part.y, BoardSquareType.SnakeBody
      );
    }
  }

  private detectCollisions(): void {
    this.detectWallCollision();
    this.detectBodyCollision();
    this.detectFoodCollision();
  }

  private detectWallCollision(): void {
    if (this.isWallCollisionEnabled) {
      // TODO
    } else {
      this.teleportSnake();
    }
  }

  private teleportSnake(): void {
    const head = this.snake.parts[0];

    if (head.x < 0) {
      head.x += this.boardService.boardWidth;
    } else if (head.x >= this.boardService.boardWidth) {
      head.x -= this.boardService.boardWidth;
    }

    if (head.y < 0) {
      head.y += this.boardService.boardHeight;
    } else if (head.y >= this.boardService.boardHeight) {
      head.y -= this.boardService.boardHeight;
    }
  }

  private detectBodyCollision(): void {
    if (this.isBodyCollisionEnabled) {
      // TODO
    }
  }

  private detectFoodCollision(): void {
    // TODO
  }

  private handleControls(): void {
    if (this.nextControlEvent === undefined) {
      return;
    }

    switch (this.nextControlEvent) {
      case ControlEvent.Up:
        if (this.snake.direction !== SnakeDirection.Down) {
          this.snake.direction = SnakeDirection.Up;
        }
        break;
      case ControlEvent.Down:
        if (this.snake.direction !== SnakeDirection.Up) {
          this.snake.direction = SnakeDirection.Down;
        }
        break;
      case ControlEvent.Left:
        if (this.snake.direction !== SnakeDirection.Right) {
          this.snake.direction = SnakeDirection.Left;
        }
        break;
      case ControlEvent.Right:
        if (this.snake.direction !== SnakeDirection.Left) {
          this.snake.direction = SnakeDirection.Right;
        }
        break;
    }

    this.nextControlEvent = undefined;
  }

  private handleControlEvent(controlEvent: ControlEvent): void {
    this.nextControlEvent ??= controlEvent;
  }

}
