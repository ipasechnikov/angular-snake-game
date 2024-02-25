import { Inject, Injectable, OnDestroy } from "@angular/core";
import { GameObjectService } from "./game-object.service";
import { GameState } from "../../enums/game-state.enum";
import { Observable, Subject, takeUntil, tap } from "rxjs";
import { CONTROLS_SERVICE_TOKEN, ControlsService } from "../controls/controls.service";
import { ControlEvent } from "../../enums/control-event.enum";

@Injectable({
  providedIn: 'root'
})
export class GameService implements GameObjectService, OnDestroy {

  private state: GameState = GameState.Play;

  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  private readonly stateChangedSubject: Subject<GameState> = new Subject<GameState>();
  readonly stateChanged$: Observable<GameState> = this.stateChangedSubject.asObservable();

  constructor(
    @Inject(CONTROLS_SERVICE_TOKEN) private readonly controlsService: ControlsService,
  ) {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  init(): void {
    this.controlsService.controlEvents$.pipe(
      tap(controlEvent => {
        if (controlEvent === ControlEvent.PlayPauseGame) {
          if (this.state === GameState.Play) {
            this.setState(GameState.Pause)
          } else if (this.state === GameState.Pause) {
            this.setState(GameState.Play);
          }
        }
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe();
  }

  update(deltaTime: number): void {
  }

  getState(): GameState {
    return this.state;
  }

  setState(state: GameState): void {
    this.state = state;
    this.stateChangedSubject.next(this.state);
  }

}
