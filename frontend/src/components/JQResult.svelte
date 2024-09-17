<script lang="ts">
	import { DownloadJQResult } from "$wails/go/main/App";
	import { Download } from "lucide-svelte";
	import CopyButton from "./CopyButton.svelte";
	import Editor from "./Editor.svelte";
	import { Button } from "./ui/button";

	export let value: string = "";

	let editor: Editor;
	const options = {
		readOnly: true,
		quickSuggestions: false,
		parameterHints: { enabled: false },
		suggestOnTriggerCharacters: false,
	};

	$: if (editor) {
		editor.setValue(value);
	}

	function download() {
		DownloadJQResult(value);
	}
</script>

<div class="relative h-full group">
	{#if value !== ""}
		<div
			class="flex absolute top-2 right-4 invisible z-50 flex-col gap-2 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100"
		>
			<CopyButton toCopy={value} />
			<Button variant="outline" size="icon" on:click={download}>
				<Download class="text-gray-500" />
			</Button>
		</div>
	{/if}
	<Editor {options} bind:this={editor} />
</div>
