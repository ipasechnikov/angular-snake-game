import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { ControlEvent } from "../../enums/control-event.enum";
import { GameObjectService } from "../game-objects/game-object.service";

export const CONTROLS_SERVICE_TOKEN = new InjectionToken<ControlsService>('ControlsService');

export interface ControlsService extends GameObjectService {

  readonly controlEvents$: Observable<ControlEvent>;

}
