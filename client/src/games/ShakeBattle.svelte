<script lang="ts">
    import {onDestroy, onMount} from 'svelte';
    import Phaser from 'phaser';
    import Logo from '../assets/logo.png';
    import {ShakeBattleScene} from "./scenes/shake-battle";

    let game;
    let resizeListener; // Hold the resize listener for cleanup

    onMount(async () => {


        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: 'phaser-game-container',
            // dark blue bg
            dom: {
                createContainer: true
            },
            backgroundColor: '#00008B',
            scene: ShakeBattleScene,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {y: 200},
                },
            },
        };


        game = new Phaser.Game(config);

        const resizeGame = () => {
            if (game) {
                game.scale.resize(window.innerWidth, window.innerHeight - 200);
                // if desktop, set a max width
                if (window.innerWidth > 500) {
                    game.scale.setGameSize(800, 600);
                }
            }
        };

        window.addEventListener('resize', resizeGame);
        resizeListener = resizeGame;


        resizeGame();

        function permission() {
            if (typeof (DeviceMotionEvent) !== "undefined" && typeof (DeviceMotionEvent.requestPermission) === "function") {
                // (optional) Do something before API request prompt.
                DeviceMotionEvent.requestPermission()
                    .then(response => {
                        // (optional) Do something after API prompt dismissed.
                        if (response == "granted") {
                            window.addEventListener("devicemotion", (e) => {
                                // do something for 'e' here.
                            })
                        }
                    })
                    .catch(console.error)
            } else {
                alert("DeviceMotionEvent is not defined");
            }
        }

        const btn = document.getElementById("request");
        btn?.addEventListener("click", permission);


    });

    onDestroy(() => {
        // Clean up the resize event listener when the component is destroyed
        if (resizeListener) {
            window.removeEventListener('resize', resizeListener);
        }

        // Optionally, destroy the Phaser game instance if not needed anymore
        if (game) {
            game.destroy(true);
        }
    });
</script>

<div>
    <button id="request">Permission</button>
    <div id="phaser-game-container"></div>
</div>