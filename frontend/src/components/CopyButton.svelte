<script lang="ts">
	import { ClipboardSetText } from "$wails/runtime/runtime";
	import { Clipboard, ClipboardCheck } from "lucide-svelte";
	import { Button } from "./ui/button";
	import { cn } from "$/lib/ui-utils";

	export let toCopy: string = "";

	let copied = false;
	let id: number;

	async function copy() {
		if (toCopy === "") {
			return;
		}

		await ClipboardSetText(toCopy);
		copied = true;

		clearTimeout(id);

		id = window.setTimeout(() => {
			copied = false;
		}, 800);
	}
</script>

<Button
	variant="outline"
	size="icon"
	class={cn(
		$$restProps.class,
		copied && "before:content-['Copied!'] before:absolute",
		copied && "before:-translate-x-[calc(100%-theme(space.4)+1px)]",
		copied && "before:h-10 before:p-2 before:flex before:items-center",
		copied && "before:border before:rounded-tl-md before:rounded-bl-md",
		copied && "before:bg-background",
		copied && "rounded-tl-none rounded-bl-none",
		copied && "opacity-100 visible",
	)}
	on:click={copy}
>
	{#if copied}
		<ClipboardCheck class="text-gray-500" />
	{:else}
		<Clipboard class="text-gray-500" />
	{/if}
</Button>
