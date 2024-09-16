<script lang="ts">
	import { main } from "$wails/go/models";
	import CopyButton from "./CopyButton.svelte";
	import { Checkbox } from "./ui/checkbox";
	import { Textarea, type FormTextareaEvent } from "./ui/textarea";

	type FlagData = {
		label: string;
		flag: string;
	};
	const FLAGS: Record<keyof main.JQFlags, FlagData> = {
		compact: {
			label: "Compact",
			flag: "-c",
		},
		raw: {
			label: "Raw",
			flag: "-r",
		},
		slurp: {
			label: "Slurp",
			flag: "-s",
		},
	};

	export let query: string = ".";
	export let flags: main.JQFlags = {
		compact: false,
		raw: false,
		slurp: false,
	};

	function getToCopy(q: string, f: main.JQFlags): string {
		const result = Object.entries(f)
			.filter(([_, enabled]) => enabled)
			.map(([key]) => FLAGS[key as keyof main.JQFlags].flag);

		result.push(`"${q}"`);

		return result.join(" ");
	}

	$: toCopy = getToCopy(query, flags);

	function handleQueryChange(e: FormTextareaEvent<Event>) {
		const value = e.currentTarget.value;
		if (value === "") {
			query = ".";
			return;
		}

		query = value;
	}

	function handleFlagChange(flag: string) {
		return (checked: boolean | string) => {
			if (typeof checked === "string") {
				return;
			}

			flags = { ...flags, [flag]: checked };
		};
	}

	// workaround to add correct type
	function flagsToEntries() {
		return Object.entries(FLAGS) as [keyof main.JQFlags, FlagData][];
	}
</script>

<div class="relative h-full group">
	<CopyButton
		class="absolute top-4 right-4 invisible opacity-0 transition-opacity group-hover:visible group-hover:opacity-100"
		{toCopy}
	/>
	<Textarea
		class="h-3/4 resize-none"
		placeholder="your query here"
		on:input={handleQueryChange}
	/>
	<div class="flex gap-2 items-center h-1/4">
		{#each flagsToEntries() as [key, flagData] (key)}
			<Checkbox
				id={key}
				checked={flags[key]}
				onCheckedChange={handleFlagChange(key)}
			/>
			<label
				for={key}
				class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{`${flagData.label} (${flagData.flag})`}
			</label>
		{/each}
	</div>
</div>
