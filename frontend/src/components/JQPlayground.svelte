<script lang="ts">
	import { setJQPlaygroundContext } from "$/context";
	import debounce from "$/lib/debounce";
	import formatJson from "$/lib/format-json";
	import readFileContents from "$/lib/read-file-contents";
	import { GetInitialContent, Query } from "$wails/go/main/App";
	import type { main } from "$wails/go/models";
	import { onMount } from "svelte";
	import Editor from "./Editor.svelte";
	import JqQuery from "./JQQuery.svelte";
	import JsonHighlighter from "./JSONHighlighter.svelte";
	import { Button } from "./ui/button";
	import {
		ResizableHandle,
		ResizablePane,
		ResizablePaneGroup,
	} from "./ui/resizable";
	import { ScrollArea, Scrollbar } from "./ui/scroll-area";

	setJQPlaygroundContext();

	let inputFileElement: HTMLInputElement;
	let editor: Editor;

	let json: string;
	let jqResult: string;
	let flags: main.JQFlags;
	let query: string;

	async function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const promises = [...(target.files ?? [])].map(readFileContents);
		const results = await Promise.all(promises);
		editor.setValue(formatJson(results.join("")));
		flags = { ...flags, slurp: promises.length > 1 };
	}

	const debouncedQuery = debounce(
		async (j: string, q: string, f: main.JQFlags) => {
			jqResult = await Query(j, q, f);
		},
	);

	$: debouncedQuery(json, query, flags);

	onMount(() => {
		GetInitialContent().then((v) => editor.setValue(formatJson(v)));
	});
</script>

<main class="w-screen h-screen">
	<div class="flex gap-2 items-center px-2 h-14 bg-gray-100">
		<input
			type="file"
			id="upload"
			accept="application/json"
			multiple
			hidden
			on:change={handleFileChange}
			bind:this={inputFileElement}
		/>
		<Button
			variant="outline"
			class="space-x-1"
			on:click={() => inputFileElement.click()}>Open file(s)</Button
		>
	</div>
	<div class="h-[calc(100%-theme(space.14))] w-full">
		<ResizablePaneGroup direction="horizontal">
			<ResizablePane defaultSize={50} class="p-2">
				<Editor bind:value={json} bind:this={editor} />
			</ResizablePane>
			<ResizableHandle />
			<ResizablePane defaultSize={50}>
				<ResizablePaneGroup direction="vertical">
					<ResizablePane defaultSize={20} class="p-2">
						<JqQuery bind:query bind:flags />
					</ResizablePane>
					<ResizableHandle />
					<ResizablePane defaultSize={80}>
						<ScrollArea class="relative p-2 h-full group">
							<JsonHighlighter json={jqResult} />
							<Scrollbar orientation="horizontal" />
						</ScrollArea>
					</ResizablePane>
				</ResizablePaneGroup>
			</ResizablePane>
		</ResizablePaneGroup>
	</div>
</main>
