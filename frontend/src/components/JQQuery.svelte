<script lang="ts">
	import { getFlags, getQuery } from "$/context";
	import debounce from "$/lib/debounce";
	import { main } from "$wails/go/models";
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

	// function getToCopy(query: string, enabledFlags: PartialJQFlags): string {
	// 	const result = Object.entries(enabledFlags)
	// 		.filter(([_, enabled]) => enabled)
	// 		.map(([key]) => FLAGS[key as keyof main.JQFlags].flag);
	//
	// 	result.push(`"${query}"`);
	//
	// 	return result.join(" ");
	// }

	const query = getQuery();
	const flags = getFlags();

	const debouncedSetQuery = debounce((value: string) => {
		if (value === "") {
			query.set(".");
			return;
		}

		query.set(value);
	});

	function handleQueryChange(e: FormTextareaEvent<Event>) {
		debouncedSetQuery(e.currentTarget.value);
	}

	function handleFlagChange(flag: string) {
		return (checked: boolean | string) => {
			if (typeof checked === "string") {
				return;
			}

			flags.update((v) => ({ ...v, [flag]: checked }));
		};
	}

	// workaround to add correct type
	function flagsToEntries() {
		return Object.entries(FLAGS) as [keyof main.JQFlags, FlagData][];
	}
</script>

<div class="relative p-2 h-full group">
	<Textarea
		class="h-3/4 resize-none"
		placeholder="your query here"
		on:input={handleQueryChange}
	/>
	<div class="flex gap-2 items-center h-1/4">
		{#each flagsToEntries() as [key, flagData] (key)}
			<Checkbox
				id={key}
				checked={$flags[key]}
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
