import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, fromEvent, takeUntil, tap } from 'rxjs';
import { ControlEvent } from '../enums/control-event.enum';
import { GameObjectService } from './game-object.service';

@Injectable({
  providedIn: 'root'
})
export class ControlsService implements GameObjectService, OnDestroy {

  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  private readonly keyboardInput$: Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(window, 'keydown').pipe(
    tap(keyboardEvent => this.onKeyDown(keyboardEvent)),
    takeUntil(this.unsubscribe$),
  );

  private readonly controlEventsSubject: Subject<ControlEvent> = new Subject<ControlEvent>();
  readonly controlEvents$: Observable<ControlEvent> = this.controlEventsSubject.asObservable();

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  init(): void {
    this.keyboardInput$.subscribe();
  }

  update(deltaTime: number): void {
  }

  private onKeyDown(event: KeyboardEvent): void {
    const controlEvent = this.mapKeyCodeToControlEvent(event.key);
    if (controlEvent !== undefined) {
      this.controlEventsSubject.next(controlEvent);
    }
  }

  private mapKeyCodeToControlEvent(key: string): ControlEvent | undefined {
    switch (key) {
      case 'w':
      case 'ArrowUp':
        return ControlEvent.Up;
      case 's':
      case 'ArrowDown':
        return ControlEvent.Down;
      case 'a':
      case 'ArrowLeft':
        return ControlEvent.Left;
      case 'd':
      case 'ArrowRight':
        return ControlEvent.Right;
      default:
        return undefined;
    }
  }

}
