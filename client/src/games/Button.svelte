<script lang="ts">
    let isAnimating = false

    export let onClickFunc = () => {
    }
    export let cooldown = false

    function triggerAnimation() {
        onClickFunc()
        isAnimating = true
        cooldown = true
        setTimeout(() => {
            isAnimating = false
        }, 500)
    }
</script>

<button
        class="button duration-150 h-20 w-full transform transition-all {cooldown
		? 'cooldown'
		: ''} {isAnimating ? 'animate bg-[#0056b3]' : ''}"
        on:click={triggerAnimation}
>
    <slot/>
</button>

<style>
    .button {
        padding: 10px 20px;
        border: none;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        outline: none;
        transition: transform 0.5s;
    }

    .animate {
        transform: scale(0.95);
        background-color: #0056b3;
    }

    .button::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.5);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0s linear 5s;
    }

    .cooldown::after {
        transition: transform 5s linear;
        transform: scaleX(1);
    }
</style>
