import { Observable } from "rxjs";
import { ControlEvent } from "../../enums/control-event.enum";
import { GameObjectService } from "../game-object.service";
import { InjectionToken } from "@angular/core";

export const CONTROLS_SERVICE_TOKEN = new InjectionToken<ControlsService>('ControlsService');

export interface ControlsService extends GameObjectService {

  readonly controlEvents$: Observable<ControlEvent>;

}
