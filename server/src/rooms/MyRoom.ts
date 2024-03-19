import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { Player } from "../entities/Player";
import { auth, JWT } from "@colyseus/auth";
import { supabase } from "../config/auth";

JWT.settings.secret =
  "xB2PoKieXV5YWWGYKgLBrkVXomalEaVMQc0DR0HUr+Ni66gr1vlc0IwP6u4Faf9htuHR14KQnqViH/gM1xNlGA==";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 2;

  onCreate(options: any) {
    this.setState(new MyRoomState());

    this.onMessage("*", (client, key, value) => {
      // action
      console.log(key, value);
      if (key === "action") {
        const action = value;
        let enemy;
        for (let [id, player] of this.state.players) {
          if (id === client.sessionId) {
            enemy = player;
            break;
          }
        }
        const damage = {
          amount: action.damage?.amount,
          type: action.damage?.type,
        };
        enemy.takeDamage(damage);
        console.log("Attacked: ", enemy.name, damage);
        this.broadcast("action", {
          id: enemy.id,
          damage: damage,
          name: enemy.name,
        });
        console.log(damage);
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    const { user } = options;
    // check if the user is already in the room and prevent them from joining again
    for (const [sessionId, player] of this.state.players) {
      if (player.name === user?.email) {
        client.send("type", { text: "You are already in the room!" });
        return client.leave();
      }
    }
    this.state.addPlayer(client, new Player(client.sessionId, user?.email));
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
