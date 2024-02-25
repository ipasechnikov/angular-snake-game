import { Injectable } from '@angular/core';
import { Observable, fromEvent, takeUntil, tap } from 'rxjs';
import { ControlEvent } from '../../enums/control-event.enum';
import { ControlsServiceBase } from './controls-base.service';

@Injectable({
  providedIn: 'root'
})
export class KeyboardControlsService extends ControlsServiceBase {

  private readonly keyboardInput$: Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(window, 'keydown').pipe(
    tap(keyboardEvent => this.onKeyDown(keyboardEvent)),
    takeUntil(this.unsubscribe$),
  );

  init(): void {
    this.keyboardInput$.subscribe();
  }

  private onKeyDown(event: KeyboardEvent): void {
    const controlEvent = this.mapKeyCodeToControlEvent(event.code);
    if (controlEvent !== undefined) {
      this.controlEventsSubject.next(controlEvent);
    }
  }

  private mapKeyCodeToControlEvent(code: string): ControlEvent | undefined {
    switch (code) {
      case 'KeyW':
      case 'ArrowUp':
        return ControlEvent.Up;
      case 'KeyS':
      case 'ArrowDown':
        return ControlEvent.Down;
      case 'KeyA':
      case 'ArrowLeft':
        return ControlEvent.Left;
      case 'KeyD':
      case 'ArrowRight':
        return ControlEvent.Right;
      case 'Space':
        return ControlEvent.PlayPauseGame;
      default:
        return undefined;
    }
  }

}
