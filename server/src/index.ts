/**
 * IMPORTANT:
 * ---------
 * Do not manually edit this file if you'd like to host your server on Colyseus Cloud
 *
 * If you're self-hosting (without Colyseus Cloud), you can manually
 * instantiate a Colyseus Server as documented here:
 *
 * See: https://docs.colyseus.io/server/api/#constructor-options
 */
import express from "express";
import { createServer } from "https";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import fs from "fs";
import { playground } from "@colyseus/playground";
import { monitor } from "@colyseus/monitor";
import { MyRoom } from "./rooms/MyRoom";
import cors from "cors";
import { auth } from "@colyseus/auth";
import { Lobby } from "./rooms/Lobby";

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use("/", playground);
}

app.use("/colyseus", monitor());

app.use(cors());

app.get("/online", (req, res) => {
  res.json(true);
});

app.get("/users", (req, res) => {
  res.json([]);
});

var options = {
  key: fs.readFileSync("./localhost+2-key.pem"),
  cert: fs.readFileSync("./localhost+2.pem"),
  requestCert: false,
  rejectUnauthorized: false,
};

const server = createServer(options, app); // create the http server manually

const gameServer = new Server({
  transport: new WebSocketTransport({
    server, // provide the custom server for `WebSocketTransport`
  }),
});

gameServer.listen(2567).then(() => {
  console.log(`Listening on ws://localhost:2567`);
});
gameServer.define("my_room", MyRoom);
gameServer.define("lobby", Lobby);
