<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './Button.svelte';

	let hammer;
	let box: HTMLElement;
	let box2;
	let totalX = 0;
	let totalY = 0;

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
				}
			});
		});
	});
</script>

<game>
	<div bind:this={box} class="bg-red-500 h-32 w-32 transform duration-500 z-10"></div>
	<footer class="flex w-full h-32 px-10 gap-1 absolute bottom-0 left-0">
		{#each new Array(3) as _, i}
			<Button
				onClickFunc={() => {
					totalX = 0;
					totalY = 0;
					box.style.transform = `translate(0px, 0px)`;
				}}
			/>
		{/each}
	</footer>
</game>

<style></style>
