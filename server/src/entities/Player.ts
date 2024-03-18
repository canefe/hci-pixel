import { Entity } from "./Entity";
import { Schema, type } from "@colyseus/schema";

enum DamageType {
  AIR = "air",
  FIRE = "fire",
  ICE = "ice",
}

export type Damage = {
  amount: number;
  type: DamageType;
};

export class Player extends Entity {
  @type("string") name: string;
  @type("number") level: number = 0;
  @type("number") health: number = 100;

  constructor(id: string, name: string) {
    super(id);
    this.name = name;
  }

  update() {
    console.log("Player updated");
  }

  takeDamage(damage: Damage) {
    console.log(damage);
    let amount = damage.amount;
    const type = damage.type;
    if (type === DamageType.FIRE) {
      amount *= 2;
    }
    if (type === DamageType.ICE) {
      amount /= 2;
    }
    if (type === DamageType.AIR) {
      amount /= 4;
    }
    console.log(amount);
    this.health -= amount;
  }
}
