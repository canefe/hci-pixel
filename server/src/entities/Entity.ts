import { Schema, type } from "@colyseus/schema";
import { MyRoomState } from "../rooms/schema/MyRoomState";

export class Entity extends Schema {
  @type("string") id: string;

  state: MyRoomState;

  constructor(id: string, state?: MyRoomState) {
    super();
    this.state = state;
    this.id = id;
  }

  update() {
    console.log("Entity updated");
  }
}
