<script lang="ts">
	import { onMount } from 'svelte';

	let hammer;
	let box;
	let box2;
	let totalX = 0;
	let totalY = 0;

	function checkWin() {
		const redBox = box.getBoundingClientRect();
		const yellowBox = box2.getBoundingClientRect();

		const isInside =
			redBox.top >= yellowBox.top - 10 &&
			redBox.left >= yellowBox.left - 10 &&
			redBox.right <= yellowBox.right + 10 &&
			redBox.bottom <= yellowBox.bottom + 10;

		if (isInside) {
			alert('win');
		}
	}

	onMount(() => {
		import('hammerjs').then(({ default: Hammer }) => {
			hammer = new Hammer(box);
			hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

			hammer.on('panstart', (ev) => {});

			hammer.on('pan', (ev) => {
				let newX = totalX + ev.deltaX;
				let newY = totalY + ev.deltaY;

				box.style.transform = `translate(${newX}px, ${newY}px)`;

				if (ev.isFinal) {
					totalX += ev.deltaX;
					totalY += ev.deltaY;
					checkWin();
				}
			});
		});
	});
</script>

<page class="center h-full">
	<container class="container transition-all transform p-8">
		<header class="center flex-col text-slate-800">
			<h1>Pixel Duel</h1>
			<p class="text-center">
				Pixel Duel is a game where you can challenge your friends to a duel of pixel art.
			</p>
		</header>
		<main class="center text-center" style="border:1px solid black;">
			<div class="flex flex-col gap-4">
				<div class="btn btn-primary">Play</div>
				<div bind:this={box} class="bg-red-500 h-32 w-32 transform duration-500 z-10"></div>
				<div bind:this={box2} class="bg-yellow-500 h-32 w-32 transform duration-500 z-0"></div>

				<div></div>
			</div>
		</main>
	</container>
</page>
