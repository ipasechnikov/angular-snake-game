import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BoardService } from '../../services/game-objects/board.service';
import { BoardSquareComponent } from '../board-square/board-square.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    BoardSquareComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {

  constructor(protected readonly boardService: BoardService) { }

  protected get boardRowHeight(): string {
    const heightPercent = 100.0 / this.boardService.boardHeight;
    const heightPercentStr = `${heightPercent}%`;
    return heightPercentStr;
  }

}
