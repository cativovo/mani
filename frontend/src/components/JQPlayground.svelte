<script lang="ts">
	import { getFlags, getQuery, setJQPlaygroundContext } from "$/context";
	import formatJson from "$/lib/formatJson";
	import readFileContents from "$/lib/readFileContents";
	import Editor from "./Editor.svelte";
	import JqQuery from "./JQQuery.svelte";
	import JsonHighlighter from "./JSONHighlighter.svelte";
	import { Button } from "./ui/button";
	import {
		ResizableHandle,
		ResizablePane,
		ResizablePaneGroup,
	} from "./ui/resizable";
	import { Query } from "$wails/go/main/App";
	import { afterUpdate } from "svelte";
	import { ScrollArea, Scrollbar } from "./ui/scroll-area";

	setJQPlaygroundContext();

	let inputFileElement: HTMLInputElement;

	let json: string;
	let jqResult: string;

	const flags = getFlags();
	const query = getQuery();

	async function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const promises = [...(target.files ?? [])].map(readFileContents);
		const results = await Promise.all(promises);
		json = formatJson(results.join(""));

		flags.update((v) => ({ ...v, slurp: promises.length > 1 }));
	}

	afterUpdate(async () => {
		jqResult = await Query(json, $query, $flags);
	});

	// TODO: get json from stdin
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
	<ResizablePaneGroup
		direction="horizontal"
		class="h-[calc(100%-theme(space.14))] py-2 w-full"
	>
		<ResizablePane defaultSize={50}>
			<Editor
				value={json}
				on:change={(e) => console.log(e.detail)}
				on:validate={(e) => console.log(e.detail)}
			/>
		</ResizablePane>
		<ResizableHandle />
		<ResizablePane defaultSize={50}>
			<ResizablePaneGroup direction="vertical">
				<ResizablePane defaultSize={20}>
					<JqQuery />
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
</main>
