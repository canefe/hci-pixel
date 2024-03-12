<script lang="ts">
    import ShakeBattle from "../../../games/ShakeBattle.svelte";
    import {onMount} from "svelte";
    import {client} from "$lib/socket";
    import {roomStore} from "$lib/roomStore";

    let room;

    export let data;

    $: roomStore.subscribe(value => {
        room = value;
    });

    onMount(async () => {
        roomStore.init(data);
    });
</script>

<div>
    <h1>Time to Battle!</h1>
    {room?.name}
</div>