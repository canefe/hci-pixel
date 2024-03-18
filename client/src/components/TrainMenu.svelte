<script>
    const menuItems = [
        {name: "Home", icon: "🏰"},
        {name: "Again", icon: ""},
        {name: "Sign out", icon: ""},
    ]
</script>

<div class="grid grid-cols-2 items-center w-full gap-1 bg-slate-600 border-dashed border border-slate-900 from-slate-600 to-slate-800 bg-gradient-to-b">

    {#each menuItems as item}
        <div class="shadow-2xl relative from-amber-700 border-8 border-amber-950 to-amber-900 bg-gradient-to-bl text-white h-48 w-full menu-button center text-xl flex-col"
             id={item.name}>
            <p class="font-bold text-3xl">{item.name.toUpperCase()}
                {item.icon}</p>
        </div>
    {/each}

</div>