<script>
    import './styles.css';
    import {SvelteToast} from '@zerodevx/svelte-toast';

    // connect to the websocket colyseus

</script>

<div class="bg-blue-400 h-full">
    <slot/>
    <SvelteToast/>
</div>
