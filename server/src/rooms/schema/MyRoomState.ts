import { Schema, Context, type, MapSchema } from "@colyseus/schema";
import { Player } from "../../entities/Player";
import { Client } from "@colyseus/core";
import { EventEmitter } from "events";

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("string") state = "waiting";

  events = new EventEmitter();

  addPlayer(client: Client, player: Player) {
    this.players.set(client.sessionId, player);
  }

  endGame() {
    this.state = "ended";
  }

  update(currentTime: number) {
    for (let [id, player] of this.players) {
      player.update();

      if (player.health <= 0) {
        this.endGame();
      }
    }
  }
}
