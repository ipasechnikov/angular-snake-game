import { Injectable } from '@angular/core';
import { Observable, fromEvent, takeUntil, tap } from 'rxjs';
import { ControlEvent } from '../../enums/control-event.enum';
import { ControlsServiceBase } from './controls-base.service';

@Injectable({
  providedIn: 'root'
})
export class TouchControlsService extends ControlsServiceBase {

  private readonly touchStart$: Observable<TouchEvent> = fromEvent<TouchEvent>(window, 'touchstart').pipe(
    tap(touchEvent => this.onTouchStart(touchEvent)),
    takeUntil(this.unsubscribe$),
  );
  private readonly touchEnd$: Observable<TouchEvent> = fromEvent<TouchEvent>(window, 'touchend').pipe(
    tap(touchEvent => this.onTouchEnd(touchEvent)),
    takeUntil(this.unsubscribe$),
  );

  private touchStart?: TouchEvent;

  init(): void {
    this.touchStart$.subscribe();
    this.touchEnd$.subscribe();
  }

  private onTouchStart(event: TouchEvent): void {
    this.touchStart = event;
  }

  private onTouchEnd(event: TouchEvent): void {
    const controlEvent = this.mapGestureToControlEvent(event);
    if (controlEvent !== undefined) {
      this.controlEventsSubject.next(controlEvent);
    }
    this.touchStart = undefined;
  }

  private mapGestureToControlEvent(touchEnd: TouchEvent): ControlEvent | undefined {
    if (this.touchStart === undefined) {
      return;
    }

    const startX = this.touchStart.touches[0].clientX;
    const startY = this.touchStart.touches[0].clientY;

    const endX = touchEnd.changedTouches[0].clientX;
    const endY = touchEnd.changedTouches[0].clientY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0
        ? ControlEvent.Right
        : ControlEvent.Left;
    }

    return deltaY > 0
      ? ControlEvent.Down
      : ControlEvent.Up;
  }

}
