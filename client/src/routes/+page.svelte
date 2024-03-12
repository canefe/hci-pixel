<script lang="ts">
    import Logo from '../assets/logo.png';
    import {fade, fly, slide} from 'svelte/transition';
    import {onMount} from "svelte";
    import {roomStore} from "$lib/roomStore";
    import * as Colyseus from "colyseus.js";
    import {client} from "$lib/socket";
    import {enhance, applyAction} from '$app/forms';
    import {goto} from "$app/navigation";
    import {toast} from "@zerodevx/svelte-toast";

    let currentHint = 0
    let logo: HTMLElement;
    let input_one: HTMLInputElement;
    let input_two: HTMLInputElement;

    export let data;

    enum ConnectionState {
        CONNECTED,
        DISCONNECTED,
        OFFLINE,
        CONNECTING,
    }

    let connectionState: ConnectionState = ConnectionState.CONNECTING;

    const hints = [
        'Did you know that you can shake your device to play?',
        'Be sure to allow motion permissions to play the game!',
        'Win a duel to advance to the next level!'
    ];

    function nextHint() {
        currentHint = (currentHint + 1) % hints.length;
    }

    function previousHint() {
        currentHint = (currentHint - 1 + hints.length) % hints.length;
    }

    onMount(async () => {
        if (client) {
            try {
                const isOnline = await client.http.get('/online', {timeout: 3000});
                console.log(isOnline.data);
                if (isOnline.data) {
                    connectionState = ConnectionState.CONNECTED;
                    console.log(connectionState)
                } else {
                    connectionState = ConnectionState.OFFLINE;
                }

            } catch (e) {
                console.error(e);
                connectionState = ConnectionState.OFFLINE;
            }
        } else {
            connectionState = ConnectionState.OFFLINE
        }
    });
    setInterval(nextHint, 5000);

    $: {
        // when connectionState is connected, move logo up smoothly and make login form appear
        // use svelte transition to make it smooth
        if (connectionState === ConnectionState.CONNECTED) {


        }
    }

    //dom content loaded
    onMount(() => {
        setTimeout(() => window.scrollTo(0, 100));
    });
</script>

<page class="center h-full">

    <container class="container transition-all transform p-8 h-full gap-4 flex flex-col">

        <header class="center flex-col text-slate-800 h-[200px]" bind:this={logo}
        >
            <img src={Logo} alt="Pixel Duel"/>
        </header>
        <main class="center text-center flex-col gap-4" transition:slide={{
                duration: 1000,
                axis: 'y'

            }}>
            {#if connectionState === ConnectionState.CONNECTED}
                {#if !data.user}
                    <form method="POST" use:enhance={({formElement, formData, action, cancel}) => {
		return async ({ result }) => {
			if (result.type === 'redirect') {
				console.log(result)
			} else {
                console.log(result)
                if (result.type === 'failure') {
                    if (result.data?.missing) {
                        toast.push('Please fill in all fields');
                    } else {
                        toast.push(result.data?.error || 'An error occurred');
                    }
                }

                if (result.type === 'success') {
                    await goto('/game');
                }

			}
		};
                        }}
                          class="flex flex-col gap-2 text-start font-bold text-lg w-full max-w-lg">
                        <label>
                            Username
                            <input name="email" type="email" value="test@test.com">
                        </label>
                        <label>
                            Password
                            <input name="password" type="password">
                        </label>
                        <button class="mt-2">Log in</button>
                    </form>
                {:else}
                    <h1 class="text-3xl">Welcome back, {data.user.email}</h1>
                {/if}
            {:else if connectionState === ConnectionState.CONNECTING}
                <loading class="circle animate-spin"/>
                {#key currentHint}
                    <hints
                            in:fade={{ duration: 600 }}
                            out:fade={{ duration: 10 }}
                            class="hints transform duration-300 xl:text-xl">{hints[currentHint]}</hints
                    >
                {/key}
            {:else if connectionState === ConnectionState.OFFLINE}
                <div class="flex items-center gap-2 hints">
                    <div class="bg-red-500 w-4 h-4 rounded-full"></div>
                    <p>Server Offline</p></div>

                <p class="text-slate text-center hints">The server is currently offline.
                    Please try again
                    later.</p>

            {/if}
        </main>
    </container>
</page>

<style>
    .circle {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background-image: conic-gradient(
                rgb(246, 213, 26) 0 25%,
                transparent 0 50%,
                rgb(250, 228, 33) 0 75%,
                transparent 0 100%
        );
        border: 1px solid #f3f3f3;
    }

    .hints {
        background-color: #f3f3f3;
        padding: 0.5rem;
        border-radius: 0.5rem;
    }

    input {
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid #f3f3f3;
        color: #333;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        color: #e2eeff
    }

    button {
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid #0056b3;
        background-color: #0056b3;
        color: #e2eeff;
    }

</style>
