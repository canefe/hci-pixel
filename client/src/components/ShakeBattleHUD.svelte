<script>
    import {toast} from "@zerodevx/svelte-toast";
    import TrainingImage from "../assets/training.png";

    // pixel battle game, duels, websocket
    const menuItems = [
        {name: "Fire Attack", icon: "🔥"},
        {name: "Air Attack", icon: "💨"},
        {name: "Ice Attack", icon: "❄️"},
        {name: "Heal Self", icon: "🩹"},
        {name: "Boom Attack", icon: "💥"},
    ]

</script>

<div class="grid grid-cols-5 items-center w-full gap-1 bg-slate-600 border-dashed border border-slate-900 from-slate-600 to-slate-800 bg-gradient-to-b">

    {#each menuItems as item}
        <huditem
                class="shadow-2xl relative from-amber-700 border-8 border-amber-950 to-amber-900 bg-gradient-to-bl h-20 text-center text-white menu-button center flex-col"
                id={item.name.split(' ')[0]}>
            {item.icon}
            <p class="font-bold text-sm">{item.name.toUpperCase()}</p>
        </huditem>
    {/each}

</div>