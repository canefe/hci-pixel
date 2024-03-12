import { Player } from "../entities/Player";
import { Client, Room } from "@colyseus/core";
import { LobbyState } from "./schema/LobbyState";
import { JWT } from "@colyseus/auth";

export class Lobby extends Room<LobbyState> {
  onCreate(options: any) {
    this.setState(new LobbyState());
  }

  onJoin(client: Client, options: any) {
    // only let the user join once check their email
    for (const [sessionId, player] of this.state.players) {
      if (player.name === options.user?.email) {
        client.send("type", { text: "You are already in the room!" });
        return client.leave();
      }
    }

    this.state.players.set(
      client.sessionId,
      new Player(client.sessionId, options.user?.email)
    );

    client.send("type", { text: "Welcome!" });
  }

  onLeave(client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  static async onAuth(token: string, request: any) {
    // print unknown object to see what it is
    return await JWT.verify(token);
  }
}
