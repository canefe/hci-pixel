# <p align="center"> Pixel Duel </p>


* Code allows device motion permission requests using DeviceMotionEvent.requestPermission() so users can interact by tilting their phone. The permission flow is implemented in askMotionPermission().

* Tilt actions are processed in the main menu page via a deviceorientation listener. Tilting right/left navigates through menu buttons, and tilting upward activates the highlighted item

* In the Shake Battle mini‑game, device orientation controls a physics ball, creating a motion-based gameplay loop

* Multiplayer networking is powered by Colyseus. The server sets up a WebSocket game server and defines a lobby and battle room

* Room logic handles player actions and broadcasts damage updates to all clients, enabling real-time multiplayer battles

# Summary

This project is called “Pixel Duel,” a mobile HCI experiment that uses motion-based input on smartphones. The client was built using Svelte and Phaser, and the server runs on Colyseus to support multiplayer gameplay. Players grant motion permission so the app can use device orientation events to control the interface. Tilting the phone moves through menus and triggers actions. In the Shake Battle mode, players steer an on-screen ball by changing their phone’s orientation to avoid hazards. The Colyseus server handles matchmaking and real-time updates, syncing player actions and health between users. The goal was to test an unconventional control method by turning and shaking the phone, creating a new way to interact with mobile games.
