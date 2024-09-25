<script lang="ts">
	import Editor from "$/components/Editor.svelte";
	import JqQuery from "$/components/JQQuery.svelte";
	import JqResult from "$/components/JQResult.svelte";
	import * as Resizable from "$/components/ui/resizable";
	import debounce from "$/lib/debounce";
	import { Query } from "$wails/go/main/App";
	import type { main } from "$wails/go/models";

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

<Resizable.PaneGroup direction="horizontal">
	<Resizable.Pane defaultSize={50} class="p-2">
		<Editor bind:value={json} />
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane defaultSize={50}>
		<Resizable.PaneGroup direction="vertical">
			<Resizable.Pane defaultSize={20} class="p-2">
				<JqQuery
					bind:query
					on:flagchange
					flags={mergeWithDefaultFlags(flags)}
				/>
			</Resizable.Pane>
			<Resizable.Handle withHandle />
			<Resizable.Pane defaultSize={80}>
				<JqResult value={jqResult} />
			</Resizable.Pane>
		</Resizable.PaneGroup>
	</Resizable.Pane>
</Resizable.PaneGroup>
