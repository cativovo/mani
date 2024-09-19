<script lang="ts">
	import Editor from "./Editor.svelte";

	export let value: string = "";

	let editor: Editor;
	const options = {
		readOnly: true,
		quickSuggestions: false,
		parameterHints: { enabled: false },
		suggestOnTriggerCharacters: false,
	};

	$: if (editor) {
		editor.setValue(value);
	}
</script>

<div class="relative py-2 h-full group">
	<Editor bind:value {options} bind:this={editor} />
</div>
