<script lang="ts">
	import JqPlayground from "$/components/JQPlayground.svelte";
	import formatJson from "$/lib/format-json";
	import readFileContents from "$/lib/read-file-contents";
	import type { main } from "$wails/go/models";
	import { FolderOpenDot } from "lucide-svelte";
	import { Button } from "./components/ui/button";
	import { onMount } from "svelte";
	import { GetInitialContent } from "$wails/go/main/App";

	let inputFileElement: HTMLInputElement;

	let flags: Partial<main.JQFlags> = {};
	let json: string;

	async function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const promises = [...(target.files ?? [])].map(readFileContents);
		const results = await Promise.all(promises);
		json = formatJson(results.join(""));
		flags = { ...flags, slurp: results.length > 1 };
	}

	onMount(() => {
		GetInitialContent().then((v) => (json = formatJson(v)));
	});
</script>

<main class="w-screen h-screen">
	<div class="flex gap-2 items-center px-2 h-14 bg-gray-100">
		<input
			type="file"
			id="upload"
			accept="application/json"
			on:change={handleFileChange}
			bind:this={inputFileElement}
			multiple
			hidden
		/>
		<Button
			variant="outline"
			class="space-x-1"
			on:click={() => inputFileElement.click()}
		>
			<FolderOpenDot class="text-gray-500" />
			<span>Open file(s)</span>
		</Button>
	</div>
	<div class="h-[calc(100%-theme(space.14))] w-full">
		<JqPlayground bind:json {flags} on:flagchange={(e) => (flags = e.detail)} />
	</div>
</main>
