import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { BoardSquareType } from '../../enums/board-square-type.enum';
import { ControlEvent } from '../../enums/control-event.enum';
import { SnakeDirection } from '../../enums/snake-direction.enum';
import { BoardSquare } from '../../models/board-square.model';
import { SnakePart } from '../../models/snake-part.model';
import { Snake } from '../../models/snake.model';
import { CONTROLS_SERVICE_TOKEN, ControlsService } from '../controls/controls.service';
import { BoardService } from './board.service';
import { GameObjectService } from './game-object.service';

@Injectable({
  providedIn: 'root'
})
export class SnakeService implements GameObjectService, OnDestroy {

  private readonly defaultDirection = SnakeDirection.Up;
  private readonly defaultSpeed = 7;
  private readonly defaultLength = 3;
  private readonly defaultGrowth = 1;
  private readonly snake: Snake = this.initSnake();

  private readonly isBodyCollisionEnabled: boolean = false;
  private readonly isWallCollisionEnabled: boolean = false;

  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  private timeElapsed: number = 0;
  private nextControlEvent?: ControlEvent;

  constructor(
    private readonly boardService: BoardService,
    @Inject(CONTROLS_SERVICE_TOKEN) private readonly controlsService: ControlsService,
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

    const head = this.snake.parts[0];
    switch (this.snake.direction) {
      case SnakeDirection.Up:
        head.y--;
        break;
      case SnakeDirection.Down:
        head.y++;
        break;
      case SnakeDirection.Left:
        head.x--;
        break;
      case SnakeDirection.Right:
        head.x++;
        break;
      default:
        throw new Error(`Unexpected direction value: ${this.snake.direction}`);
    }

    if (head.x < 0) {
      head.x = this.boardService.boardWidth - 1;
    } else if (head.x >= this.boardService.boardWidth) {
      head.x = 0;
    }

    if (head.y < 0) {
      head.y = this.boardService.boardHeight - 1;
    } else if (head.y >= this.boardService.boardHeight) {
      head.y = 0;
    }
  }

  private updateSnake(deltaTime: number): void {
    this.timeElapsed += deltaTime;
    const steps = Math.floor(this.snake.speed * this.timeElapsed / 1000);
    if (steps > 0) {
      this.timeElapsed = 0;
      this.handleControls();
    }

    for (let i = 0; i < steps; i++) {
      const lookAheadSquare = this.lookAheadSquare();
      this.detectCollisions(lookAheadSquare);
      this.stepParts();
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

  private detectCollisions(lookAheadSquare: BoardSquare): void {
    this.detectWallCollision(lookAheadSquare);
    this.detectBodyCollision(lookAheadSquare);
    this.detectFoodCollision(lookAheadSquare);
  }

  private detectWallCollision(lookAheadSquare: BoardSquare): void {
    if (!this.isWallCollisionEnabled) {
      return;
    }
  }

  private detectBodyCollision(lookAheadSquare: BoardSquare): void {
    if (!this.isBodyCollisionEnabled) {
      return;
    }
  }

  private detectFoodCollision(lookAheadSquare: BoardSquare): void {
    if (lookAheadSquare.type === BoardSquareType.Food) {
      this.grow();
    }
  }

  private grow(): void {
    const tail = this.snake.parts[this.snake.parts.length - 1];
    for (let i = 0; i < this.defaultGrowth; i++) {
      this.snake.parts.push({
        x: tail.x,
        y: tail.y,
      });
    }
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

  private lookAheadSquare(): BoardSquare {
    const head = this.snake.parts[0];
    let lookAheadX = head.x;
    let lookAheadY = head.y;

    switch (this.snake.direction) {
      case SnakeDirection.Up:
        lookAheadY--;
        break;
      case SnakeDirection.Down:
        lookAheadY++;
        break;
      case SnakeDirection.Left:
        lookAheadX--;
        break;
      case SnakeDirection.Right:
        lookAheadX++;
        break;
      default:
        throw new Error(`Unexpected direction value: ${this.snake.direction}`);
    }

    if (lookAheadX >= this.boardService.boardWidth) {
      lookAheadX = this.isWallCollisionEnabled ? -1 : 0;
    } else if (lookAheadX < 0) {
      lookAheadX = this.isWallCollisionEnabled
        ? -1
        : this.boardService.boardWidth - 1;
    }

    if (lookAheadY >= this.boardService.boardHeight) {
      lookAheadY = this.isWallCollisionEnabled ? -1 : 0;
    } else if (lookAheadY < 0) {
      lookAheadY = this.isWallCollisionEnabled
        ? -1
        : this.boardService.boardHeight - 1;
    }

    if (lookAheadX === -1 || lookAheadY === -1) {
      return {
        x: -1,
        y: -1,
        type: BoardSquareType.Wall,
      };
    }

    return this.boardService.getSquare(lookAheadX, lookAheadY);
  }

}
