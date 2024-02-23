import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ControlEvent } from "../../enums/control-event.enum";
import { ControlsService } from "./controls.service";

@Injectable()
export abstract class ControlsServiceBase implements ControlsService, OnDestroy {

  protected readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected readonly controlEventsSubject: Subject<ControlEvent> = new Subject<ControlEvent>();
  readonly controlEvents$: Observable<ControlEvent> = this.controlEventsSubject.asObservable();

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  update(deltaTime: number): void {
  }

  abstract init(): void;

}
