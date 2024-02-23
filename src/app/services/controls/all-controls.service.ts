import { merge, takeUntil, tap } from "rxjs";
import { ControlsServiceBase } from "./controls-base.service";
import { ControlsService } from "./controls.service";
import { KeyboardControlsService } from "./keyboard-controls.service";
import { TouchControlsService } from "./touch-controls.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AllControlsService extends ControlsServiceBase {

  private readonly controls: ControlsService[] = [];

  constructor(
    touchControls: TouchControlsService,
    keyboardControls: KeyboardControlsService,
  ) {
    super();
    this.controls.push(touchControls);
    this.controls.push(keyboardControls);
  }

  init(): void {
    merge(...this.controls.map(c => {
      c.init();
      return c.controlEvents$;
    })).pipe(
      tap(controlEvent => this.controlEventsSubject.next(controlEvent)),
      takeUntil(this.unsubscribe$),
    ).subscribe();
  }

}
