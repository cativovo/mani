<script lang="ts">
	import { cn } from "$/lib/ui-utils";
	import { ClipboardSetText } from "$wails/runtime/runtime";
	import { Clipboard, ClipboardCheck } from "lucide-svelte";
	import { createEventDispatcher } from "svelte";
	import { Button } from "./ui/button";

	export let toCopy: string = "";

	const dispatch = createEventDispatcher<{
		copy: boolean;
	}>();

	let id: number;
	let isAlertVisible: boolean = false;

	async function copy() {
		if (toCopy === "") {
			return;
		}

		await ClipboardSetText(toCopy);
		isAlertVisible = true;
		dispatch("copy", true);

		clearTimeout(id);

		id = window.setTimeout(() => {
			isAlertVisible = false;
			dispatch("copy", false);
		}, 800);
	}
</script>

<Button
	variant="outline"
	size="icon"
	class={cn(
		$$restProps.class,
		isAlertVisible && "before:content-['Copied!'] before:absolute",
		isAlertVisible && "before:-translate-x-[calc(100%-theme(space.4)+1px)]",
		isAlertVisible && "before:h-10 before:p-2 before:flex before:items-center",
		isAlertVisible && "before:border before:rounded-tl-md before:rounded-bl-md",
		isAlertVisible && "before:bg-background",
		isAlertVisible && "rounded-tl-none rounded-bl-none",
	)}
	on:click={copy}
>
	{#if isAlertVisible}
		<ClipboardCheck class="text-gray-500" />
	{:else}
		<Clipboard class="text-gray-500" />
	{/if}
</Button>
