<script lang="ts">
    import ShakeBattle from "../../../games/ShakeBattle.svelte";
    import {onMount} from "svelte";
    import {client} from "$lib/socket";
    import {roomStore} from "$lib/roomStore";
    import {gsap} from "gsap";
    import {toast} from "@zerodevx/svelte-toast";
    import {goto} from "$app/navigation";
    import MainMenu from "../../../components/MainMenu.svelte";
    import ShakeBattleHUD from "../../../components/ShakeBattleHUD.svelte";

    let room;
    let roomState;

    let player;
    let opponent;

    let crosshair: HTMLDivElement;
    let highligtedButton: Element;

    let isTilted = true; // Track if the device is currently tilted
    const neutralTolerance = 10; // Tolerance for determining neutral position
    let isCooldown = false;
    const cooldownTime = 500; // 1 second
    let betaShower = 0;
    let currentButtonIndex = 0;

    export let data;

    $: roomStore.subscribe(value => {
        room = value;
    });

    $: roomStore.roomState(value => {
        roomState = value;
        setPlayerAndOpponent()
    });

    onMount(async () => {
        await roomStore.init(data);

        setTimeout(() => {
            startIntro();
        }, 3000);
    });

    function startGame() {
        room.send("hitEnemy", {damage: 10});
    }

    $: {
        room?.onMessage("hitEnemy", (data) => {
            // check if the player is the one who hit the enemy
            const playerHealth = document.getElementById("playerProgress");
            const opponentHealth = document.getElementById("opponentProgress");
            if (data.id === room.sessionId) {

                gsap.to(opponentHealth, {width: `${data.health}%`, duration: 0.5});
            } else {
                gsap.to(playerHealth, {width: `${data.health}%`, duration: 0.5});

            }
        });

        room?.onMessage("action", (data) => {
            // check if the player is the one who hit the enemy
            const playerHealth = document.getElementById("playerProgress");
            const opponentHealth = document.getElementById("opponentProgress");
            if (data.id === room.sessionId) {
                gsap.to(opponentHealth, {width: `${data.health}%`, duration: 0.5});
            } else {
                gsap.to(playerHealth, {width: `${data.health}%`, duration: 0.5});

            }
        });
    }

    function setPlayerAndOpponent() {
        for (const [key, value] of (roomState?.players || [])) {
            if (key === room.sessionId) {
                player = value;
            } else {
                opponent = value;
            }
        }
    }

    /**
     * Start the intro animation
     */
    let introStarted = false;

    function startIntro() {
        if (introStarted) return;
        introStarted = true;

        const tl = gsap.timeline();

        tl.to(".first-intro", {opacity: 1, duration: 3});
        tl.to(".first-intro", {opacity: 0, duration: 3});
        tl.to(".second-intro", {opacity: 1, duration: 3});
        tl.to(".second-intro", {opacity: 0, duration: 3});
        tl.to(".third-intro", {opacity: 1, duration: 3});
        tl.to(".third-intro", {opacity: 0, duration: 3});


    }

    onMount(() => {
        const buttons = document.querySelectorAll('.menu-button');
        if (buttons.length > 0) {
            buttons[currentButtonIndex].classList.add('highlight');
            highligtedButton = buttons[currentButtonIndex];
        }
    });

    function updateHighlight(newIndex: number) {
        const buttons = document.querySelectorAll('.menu-button');

        buttons[currentButtonIndex].classList.remove('highlight');


        currentButtonIndex = newIndex;
        if (currentButtonIndex >= buttons.length) {
            currentButtonIndex = 0;
        } else if (currentButtonIndex < 0) {
            currentButtonIndex = buttons.length - 1;
        }
        // check if any other button is highlighted
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].classList.contains('highlight')) {
                buttons[i].classList.remove('highlight');
            }
        }
        buttons[currentButtonIndex].classList.add('highlight');
        highligtedButton = buttons[currentButtonIndex];
    }

    function startCooldown() {
        isCooldown = true;
        setTimeout(() => {
            isCooldown = false;
        }, cooldownTime);
    }

    function handleOrientation(e) {
        // X can be in range of 100 to -100
        let crosshairX = (e.gamma * 3)
        let crosshairY = (e.beta * -1.5) + 125
        crosshair.style.transform = `translate(${crosshairX}px, ${-crosshairY}px)`;
        betaShower = e.beta;
        const gammaNeutral = Math.abs(e.gamma) < neutralTolerance;
        const betaNeutral = (Math.abs(e.beta) > 70) && (Math.abs(e.beta) < 100);

        if (gammaNeutral && betaNeutral && isTilted && !isCooldown) {
            // Device has returned to neutral, ready for next action
            const el = document.getElementById('crosshair-border')
            el.classList.remove('border-red-500')
            el.classList.add('border-green-500')
            isTilted = false;
            return;
        }
        // Process tilt actions only if the device is not already tilted
        if (!isTilted && !isCooldown) {
            const sensitivity = 40;
            if (e.gamma > sensitivity) {
                // Device tilted to the right
                updateHighlight(currentButtonIndex + 1);
                isTilted = true;
            } else if (e.gamma < -sensitivity) {
                // Device tilted to the left
                updateHighlight(currentButtonIndex - 1);
                isTilted = true;
            }


            if (e.beta < 40) {
                // Device tilted upwards, consider as a "click"

                room.send('action', {
                    damage: {
                        amount: 10,
                        type: highligtedButton.id.toLowerCase()
                    }

                });

                isTilted = true;
            }


            if (isTilted) {
                startCooldown();
                const el = document.getElementById('crosshair-border')
                el.classList.remove('border-green-500')
                el.classList.add('border-red-500')
            }
        }
    }


    window.addEventListener('deviceorientation', handleOrientation, true)
</script>

<div class="bg-black w-full h-full flex items-center flex-col">
    <h1 class="opponent text-white text-lg flex items-center justify-center pt-10">
        {opponent?.name} - {opponent?.level} Level
    </h1>
    <div class="progressBar">
        <div id="opponentProgress" class="progressBarFill !bg-red-700"></div>
    </div>
    <h1 class="first-intro">
        <span class="text-4xl text-white">Welcome to</span>
        <span class="text-6xl text-white">Shake Battle</span>
    </h1>

    <h1 class="second-intro">
        <span class="text-4xl text-white">Shake your phone to</span>
        <span class="text-6xl text-white">defeat your opponent</span>
    </h1>

    <h1 class="third-intro">
        <span class="text-4xl text-white">Are you ready?</span>
        <span class="text-6xl text-white">Shake!</span>
    </h1>

    <div class="monster transition-all  duration-500">

    </div>
    <div bind:this={crosshair} class="crosshair absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div class="w-5 h-5 bg-purple-300 rounded border border-purple-700"></div>
    </div>
    <ShakeBattleHUD/>
    <div class="absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div id="crosshair-border" class="w-10 h-10 bg-purple-600/10 border"></div>
    </div>
    <button class="bg-blue-500 text-white p-2 rounded absolute bottom-20" on:click={startGame}>
        Start Game
    </button>

    <h1 class="player text-white text-lg flex items-center justify-center absolute bottom-10 left-0 right-0">
        {player?.email} - {player?.level} Level
    </h1>
    <div class="progressBar absolute bottom-5">
        <div class="progressBarFill " id="playerProgress"></div>
    </div>

</div>

<style>

    .first-intro {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        opacity: 0;
    }

    .second-intro {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        opacity: 0;
    }

    .third-intro {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        opacity: 0;
    }

    .monster {
        width: 100px;
        height: 100px;
        background-color: red;
        position: absolute;
        top: 25%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-image: url('/images/monster.png');
        background-size: contain;
    }

    .progressBar {
        height: 10px;
        width: 80%;
        background-color: #4a5568;
    }

    .progressBarFill {
        height: 100%;
        background-color: #38b2ac;
        width: 100%;
    }

</style>