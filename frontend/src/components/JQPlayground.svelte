<script lang="ts">
	import debounce from "$/lib/debounce";
	import { Query } from "$wails/go/main/App";
	import type { main } from "$wails/go/models";
	import Editor from "./Editor.svelte";
	import JqQuery from "./JQQuery.svelte";
	import JqResult from "./JQResult.svelte";
	import {
		ResizableHandle,
		ResizablePane,
		ResizablePaneGroup,
	} from "./ui/resizable";

	export let flags: Partial<main.JQFlags> = {};
	export let json: string;

	let jqResult: string;
	let query: string;

	function mergeWithDefaultFlags(f: Partial<main.JQFlags>): main.JQFlags {
		const defaultFlags = {
			compact: false,
			raw: false,
			slurp: false,
		};

		return { ...defaultFlags, ...f };
	}

	const debouncedQuery = debounce(
		async (j: string, q: string, f: Partial<main.JQFlags>) => {
			jqResult = await Query(j, q, mergeWithDefaultFlags(f));
		},
	);

	$: if (json) {
		debouncedQuery(json, query, flags);
	} else {
		jqResult = "";
	}
</script>

<ResizablePaneGroup direction="horizontal">
	<ResizablePane defaultSize={50} class="p-2">
		<Editor bind:value={json} />
	</ResizablePane>
	<ResizableHandle withHandle />
	<ResizablePane defaultSize={50}>
		<ResizablePaneGroup direction="vertical">
			<ResizablePane defaultSize={20} class="p-2">
				<JqQuery
					bind:query
					on:flagchange
					flags={mergeWithDefaultFlags(flags)}
				/>
			</ResizablePane>
			<ResizableHandle withHandle />
			<ResizablePane defaultSize={80}>
				<JqResult value={jqResult} />
			</ResizablePane>
		</ResizablePaneGroup>
	</ResizablePane>
</ResizablePaneGroup>
