<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import {type ErrorRoomState, roomStore} from "$lib/roomStore";
    import * as Colyseus from "colyseus.js";
    import ShakeBattle from "../../games/ShakeBattle.svelte";
    import {shakeBattleStore} from "$lib/shakeBattleStore";
    import Button from "../../games/Button.svelte";

    let room: Colyseus.Room | null | ErrorRoomState;

    let playerScore = 0

    let motionPermission = false

    export let data;

    $: shakeBattleStore.subscribe(value => {
        console.log(value)
        playerScore = value.score
    });


    let countDown = 5;
    let interval;

    onMount(() => {
        roomStore.init(data);

        // check if motion is already enabled

    });

    $: roomStore.subscribe(value => {
        room = value;
    });


    function setupCountdown() {
        clearInterval(interval);
        countDown = 2;

        interval = setInterval(() => {
            countDown--;
            if (countDown === 0) {
                clearInterval(interval);
            }
        }, 1000);
    }

    // countdown
    $: if (motionPermission) {
        setupCountdown();
    } else {
        clearInterval(interval);
    }

    onDestroy(() => {
        clearInterval(interval); // Cleanup on destroy
    });

    function isMotionSupported() {
        if (typeof (DeviceMotionEvent) !== "undefined") {
            // (optional) Do something before API request prompt.
            console.log("DeviceMotionEvent is supported")
            DeviceMotionEvent.requestPermission()
                .then(response => {
                    // (optional) Do something after API prompt dismissed.
                    if (response == "granted") {
                        motionPermission = true
                    }
                })
                .catch(console.error)
        }
    }


</script>

<div class="flex items-center justify-center h-full">
    <div>
        {#if !motionPermission}
            <h1 class="text-red-900 text-center text-xl p-3">
                You need to enable motion to play this game.
            </h1>
            <Button onClickFunc={isMotionSupported}>Enable Motion</Button>
        {:else}
            {#if countDown === 0}
                {#if playerScore === 0}
                    <ShakeBattle {room}/>
                {:else}
                    <h1>Your score: {playerScore}</h1>
                {/if}
            {:else}
                <div>
                    <h1>Dodge to win!</h1>
                    <h1>{countDown}</h1>
                </div>
            {/if}
        {/if}
    </div>
</div>