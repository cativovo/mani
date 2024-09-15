<script lang="ts">
	import Editor from "./Editor.svelte";
	import { Button } from "./ui/button";
</script>

<main class="h-screen w-screen">
	<Button>click me</Button>
	<Editor
		value={JSON.stringify({ foo: true }, null, 2)}
		on:change={(e) => console.log(e.detail)}
		on:validate={(e) => console.log(e.detail)}
	/>
</main>
