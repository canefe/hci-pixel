import { Schema, Context, type, MapSchema } from "@colyseus/schema";
import { Player } from "../../entities/Player";

export class LobbyState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
