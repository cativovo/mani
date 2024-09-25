<script lang="ts">
	import Editor from "$/components/Editor.svelte";

	export let value: string = "";

	const options = {
		readOnly: true,
		quickSuggestions: false,
		parameterHints: { enabled: false },
		suggestOnTriggerCharacters: false,
	};
</script>

<div class="relative py-2 h-full group">
	<Editor {value} {options} />
</div>
