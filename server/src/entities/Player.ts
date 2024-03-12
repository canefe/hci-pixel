import { Entity } from "./Entity";
import { Schema, type } from "@colyseus/schema";

export class Player extends Entity {
  @type("string") name: string;
  @type("number") level: number = 0;

  constructor(id: string, name: string) {
    super(id);
    this.name = name;
  }

  update() {
    console.log("Player updated");
  }
}
