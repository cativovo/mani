<script lang="ts">
	let counter = 0;
</script>

<main>
	<h1 class="bg-red-300">{counter}</h1>
	<button on:click={() => counter++} class="bg-blue-600">click me</button>
</main>
