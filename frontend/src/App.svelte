<script lang="ts">
	import JqPlayground from "$/components/JQPlayground.svelte";
	import ScrollArea from "$/components/ui/scroll-area/scroll-area.svelte";
	import * as Tabs from "$/components/ui/tabs";
	import formatJson from "$/lib/format-json";
	import readFileContents from "$/lib/read-file-contents";
	import { GetInitialContent } from "$wails/go/main/App";
	import type { main } from "$wails/go/models";
	import { CirclePlus, CircleX, FolderOpenDot } from "lucide-svelte";
	import { onMount } from "svelte";
	import { Button } from "./components/ui/button";

	type Tab = {
		id: number;
		flags: Partial<main.JQFlags>;
		json: string;
	};

	let inputFileElement: HTMLInputElement;

	let currentTab: number;
	let id = 0;
	let tabs: Array<Tab> = [];

	function handleFlagChange(id: number) {
		return (e: CustomEvent<main.JQFlags>) => {
			tabs = tabs.map((tab) => {
				if (tab.id === id) {
					tab.flags = e.detail;
				}
				return tab;
			});
		};
	}

	function newTab(json: string, flags?: Partial<main.JQFlags>) {
		const tab = {
			id,
			json,
			flags: flags ?? {},
		};
		id++;
		tabs = [...tabs, tab];
		currentTab = tabs.length - 1;
	}

	async function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const promises = [...(target.files ?? [])].map(readFileContents);
		const results = await Promise.all(promises);
		newTab(formatJson(results.join("")), {
			slurp: results.length > 1,
		});
	}

	function closeTab(id: number) {
		// FIXME: doesn't automatically focus on last remaining tab
		const i = tabs.findIndex((tab) => tab.id === id);
		if (i > -1) {
			tabs = tabs.toSpliced(i, 1);
			if (i > 0) {
				currentTab = i - 1;
			}
		}
	}

	// always creates new tab
	onMount(() => {
		GetInitialContent().then((v) => {
			newTab(formatJson(v));
		});
	});
</script>

<main class="w-screen h-screen">
	<Tabs.Root
		value={currentTab ? currentTab.toString() : undefined}
		class="w-full h-full"
	>
		<div class="flex gap-2 items-center px-2 h-14 bg-gray-100">
			<input
				type="file"
				id="upload"
				accept="application/json"
				bind:this={inputFileElement}
				on:change={handleFileChange}
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
			<ScrollArea orientation="horizontal" class="max-w-80">
				<Tabs.List>
					{#each tabs as tab, i (tab.id)}
						<Tabs.Trigger
							value={i.toString()}
							on:click={() => (currentTab = i)}
						>
							{i + 1}
						</Tabs.Trigger>
					{/each}
				</Tabs.List>
			</ScrollArea>
			<Button
				variant="outline"
				class="p-2 space-x-1 h-8"
				on:click={() => newTab("")}
			>
				<CirclePlus class="text-gray-500" />
			</Button>
		</div>
		{#each tabs as tab, i (tab.id)}
			<Tabs.Content
				value={i.toString()}
				class="h-[calc(100%-theme(space.14))] w-full relative mt-0 group"
			>
				{#if tabs.length > 1}
					<Button
						variant="ghost"
						size="icon"
						class="absolute right-0 -top-10 z-50 p-0 bg-white rounded-full shadow-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
						on:click={() => closeTab(tab.id)}
					>
						<CircleX class="text-red-600" />
					</Button>
				{/if}
				<JqPlayground
					bind:json={tab.json}
					flags={tab.flags}
					on:flagchange={handleFlagChange(tab.id)}
				/>
			</Tabs.Content>
		{/each}
	</Tabs.Root>
</main>
