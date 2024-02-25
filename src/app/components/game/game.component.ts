import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GameState } from '../../enums/game-state.enum';
import { GameLoopService } from '../../services/game-loop.service';
import { GameService } from '../../services/game-objects/game.service';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    BoardComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit, AfterViewInit {

  protected readonly isPausedOverlayDisplayed$: Observable<boolean>;

  constructor(
    gameService: GameService,
    private readonly gameLoop: GameLoopService,
  ) {
    this.isPausedOverlayDisplayed$ = gameService.stateChanged$.pipe(
      map(state => state === GameState.Pause),
    );
  }

  ngOnInit(): void {
    this.gameLoop.init();
  }

  ngAfterViewInit(): void {
    this.gameLoop.start();
  }

}
