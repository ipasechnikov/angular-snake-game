import { SnakeDirection } from "../enums/snake-direction.enum";
import { SnakePart } from "./snake-part.model";

export interface Snake {

  direction: SnakeDirection;
  speed: number;
  parts: SnakePart[];

}
