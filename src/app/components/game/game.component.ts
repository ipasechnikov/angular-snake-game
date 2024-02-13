import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GameLoopService } from '../../services/game-loop.service';
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

  constructor(private readonly gameLoop: GameLoopService) { }

  ngOnInit(): void {
    this.gameLoop.init();
  }

  ngAfterViewInit(): void {
    this.gameLoop.start();
  }

}
