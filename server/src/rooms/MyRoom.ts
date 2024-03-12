import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { Player } from "../entities/Player";
import { auth, JWT } from "@colyseus/auth";
import { supabase } from "../config/auth";

JWT.settings.secret =
  "xB2PoKieXV5YWWGYKgLBrkVXomalEaVMQc0DR0HUr+Ni66gr1vlc0IwP6u4Faf9htuHR14KQnqViH/gM1xNlGA==";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    this.onMessage("updateState", (client, message) => {
      this.state.x = message?.playerBox?.x;
      this.state.y = message?.playerBox?.y;
      console.log(this.state.x);
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    this.state.players.set(
      client.sessionId,
      new Player(client.sessionId, "Guest")
    );
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

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
