<script lang="ts">
	import { codeToHtml } from "shiki";

	export let json: string = "";

	$: promise = codeToHtml(json, {
		lang: "json",
		theme: "github-light-default",
	});
</script>

<div>
	{#await promise}
		...
	{:then value}
		{@html value}
	{/await}
</div>
