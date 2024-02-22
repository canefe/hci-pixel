<script>
	import './styles.css';
	import { SvelteToast } from '@zerodevx/svelte-toast';
</script>

<div class="bg-blue-400 h-[100svh]">
	<slot />
	<SvelteToast />
</div>
