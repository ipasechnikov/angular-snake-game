import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { BoardSquareType } from '../../enums/board-square-type.enum';
import { BoardSquare } from '../../models/board-square.model';

@Component({
  selector: 'app-board-square',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './board-square.component.html',
  styleUrl: './board-square.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardSquareComponent implements OnInit, OnDestroy {

  @Input({ required: true }) model!: BoardSquare;
  @Input() redraw$?: Observable<void>;

  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private readonly cdf: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.redraw$?.pipe(
      tap(() => this.redrawHandler()),
      takeUntil(this.unsubscribe$),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected get isSnakeHead(): boolean {
    return this.model.type === BoardSquareType.SnakeHead;
  }

  protected get isSnakeBody(): boolean {
    return this.model.type === BoardSquareType.SnakeBody;
  }

  protected get isFood(): boolean {
    return this.model.type === BoardSquareType.Food;
  }

  protected get isEmpty(): boolean {
    return this.model.type === BoardSquareType.Empty;
  }

  private redrawHandler(): void {
    this.cdf.markForCheck();
  }

}
