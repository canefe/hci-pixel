<script>
    import {toast} from "@zerodevx/svelte-toast";
    import TrainingImage from "../assets/training.png";

    // pixel battle game, duels, websocket
    const menuItems = [
        {name: "Fire Attack", icon: "🔥"},
        {name: "Air Attack", icon: "💨"},
        {name: "Ice Attack", icon: "❄️"},
        {name: "Heal Self", icon: "🩹"},
    ]
    
</script>

<div class="grid grid-cols-4 items-center w-full gap-1 bg-slate-600 border-dashed border border-slate-900 from-slate-600 to-slate-800 bg-gradient-to-b">

    {#each menuItems as item}
        <huditem
                class="shadow-2xl relative from-amber-700 border-8 border-amber-950 to-amber-900 bg-gradient-to-bl h-full text-white menu-button center text-xl flex-col"
                id={item.name.split(' ')[0]}>
            <p class="font-bold text-xl">{item.name.toUpperCase()}
                {item.icon}</p>
        </huditem>
    {/each}

</div>