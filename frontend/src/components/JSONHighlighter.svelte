<script lang="ts">
	import { DownloadJQResult } from "$wails/go/main/App";
	import { Download } from "lucide-svelte";
	import { codeToHtml } from "shiki";
	import CopyButton from "./CopyButton.svelte";
	import { Button } from "./ui/button";
	import { ScrollArea, Scrollbar } from "./ui/scroll-area";

	export let json: string = "";

	$: promise = codeToHtml(json, {
		lang: "json",
		theme: "github-light-default",
	});

	function download() {
		DownloadJQResult(json);
	}
</script>

<ScrollArea class="relative p-2 h-full group">
	{#if json !== ""}
		<div
			class="flex absolute top-2 right-4 invisible flex-col gap-2 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100"
		>
			<CopyButton toCopy={json} />
			<Button variant="outline" size="icon" on:click={download}>
				<Download class="text-gray-500" />
			</Button>
		</div>
	{/if}

	{#await promise}
		...
	{:then value}
		{@html value}
	{/await}
	<Scrollbar orientation="horizontal" />
</ScrollArea>
