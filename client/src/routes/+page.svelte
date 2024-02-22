<script lang="ts">
	import Logo from '../assets/logo.png';
	import { fade } from 'svelte/transition';

	let currentHint = 0;

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

	// automatically change the hint every 5 seconds
	setInterval(nextHint, 5000);
</script>

<page class="center h-full">
	<container class="container transition-all transform p-8 grid-cols-1 gap-4 grid-rows-2 grid">
		<header class="center flex-col text-slate-800">
			<img src={Logo} alt="Pixel Duel" />
		</header>
		<main class="center text-center flex-col gap-4">
			<loading class="circle animate-spin" />
			{#key currentHint}
				<hints
					in:fade={{ duration: 600 }}
					out:fade={{ duration: 10 }}
					class="hints transform duration-300">{hints[currentHint]}</hints
				>
			{/key}
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
		font-size: 0.8rem;
		background-color: #f3f3f3;
		padding: 0.5rem;
		border-radius: 0.5rem;
	}
</style>
