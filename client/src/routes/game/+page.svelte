<script lang="ts">
    import {onMount} from "svelte";
    import {type ErrorRoomState, type RoomState, roomStore} from "$lib/roomStore";
    import * as Colyseus from "colyseus.js";
    import LootMusic from "../../assets/loop-music.wav";
    import MainMenu from "../../components/MainMenu.svelte";
    import {askMotionPermission, motionPermission} from "$lib/motion";
    import Button from "../../games/Button.svelte";
    import {toast} from "@zerodevx/svelte-toast";
    import {goto} from "$app/navigation";

    let room: Colyseus.Room<RoomState> | null | ErrorRoomState;
    let roomState: RoomState | null | ErrorRoomState;
    let audio: HTMLMediaElement;

    let crosshair: HTMLDivElement;
    let highligtedButton: Element;

    let isTilted = false; // Track if the device is currently tilted
    const neutralTolerance = 10; // Tolerance for determining neutral position
    let isCooldown = false;
    const cooldownTime = 500; // 1 second
    let betaShower = 0;

    let currentButtonIndex = 0;

    let permission = false;

    $: motionPermission.subscribe(value => {
        permission = value;
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
            toast.push('neutral');
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
                toast.push((highligtedButton as HTMLButtonElement).id);
                const translate = {
                    'Battle': '/game/battle',
                    'settings': '/settings',
                    'exit': '/exit'
                }
                window.removeEventListener('deviceorientation', handleOrientation, true)
                goto(translate[(highligtedButton as HTMLButtonElement).id as string]);
                (highligtedButton as HTMLButtonElement).name
                isTilted = true;
            }

            if (isTilted) {
                startCooldown();
            }
        }
    }


    window.addEventListener('deviceorientation', handleOrientation, true)

    export let data;

    onMount(() => {
        data.room = 'lobby';
        roomStore.init(data);


        audio.volume = 0.25;

        if (audio.paused) {
            audio.play();
        }

        const buttons = document.querySelectorAll('.menu-button');
        if (buttons.length > 0) {
            buttons[currentButtonIndex].classList.add('highlight');
            highligtedButton = buttons[currentButtonIndex];
        }

    });

    $: roomStore.subscribe(value => {
        room = value;
    });

    $: roomStore.roomState(value => {
        roomState = value;
    });

    $: {
        // loop MapValue to key, value
        for (const [key, value] of (roomState?.players || [])) {
            console.log(key, value);
        }
    }


</script>

<div class="flex flex-col items-center justify-center h-full w-full p-3 gap-3">
    {#if !permission}
        <div class="z-10 absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center">
            <div class="text-white text-2xl text-center">
                <p>Enable Motion Permission</p>
                <p>to play this game</p>
                <Button onClickFunc={askMotionPermission}>
                    Enable
                </Button>
            </div>
        </div>
    {/if}
    {isTilted}
    {betaShower}
    cooldown: {isCooldown}
    <MainMenu/>
    <div bind:this={crosshair} class="crosshair absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div class="w-5 h-5 bg-purple-600 rounded border border-purple-700"></div>
    </div>
    <div class="absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div class="w-10 h-10 bg-purple-600/10 border border-purple-700"></div>
    </div>

    <audio loop controls autoplay bind:this={audio} volume={0.1}>
        <source src={LootMusic} type="audio/wav">
        Your browser does not support the audio element.
    </audio>
</div>

<style>
    .highlight {
        background-color: red;
    }
</style>