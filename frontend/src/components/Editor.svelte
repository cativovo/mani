<script lang="ts">
	import * as monaco from "monaco-editor";
	import { afterUpdate, createEventDispatcher, onMount } from "svelte";

	export let value: string = "";

	let editorElement: HTMLDivElement;
	let editor: monaco.editor.IStandaloneCodeEditor;

	const dispatch = createEventDispatcher<{
		validate: monaco.editor.IMarker[];
		change: string;
	}>();

	function addOnChangeHandler(ed: monaco.editor.IStandaloneCodeEditor) {
		ed.onDidChangeModelContent(() => {
			dispatch("change", ed.getValue());
		});
	}

	function addOnValidateHandler(ed: monaco.editor.IStandaloneCodeEditor) {
		// https://github.com/suren-atoyan/monaco-react/blob/f7cac39fbad0f062dc66458831aaf57a7126dd40/src/Editor/Editor.tsx#L221
		monaco.editor.onDidChangeMarkers((uris) => {
			const editorUri = ed.getModel()?.uri;
			if (!editorUri) {
				return;
			}

			const currentEditorHasMarkerChanges = uris.some(
				(uri) => uri.path === editorUri.path,
			);
			if (!currentEditorHasMarkerChanges) {
				return;
			}

			const markers = monaco.editor.getModelMarkers({
				resource: editorUri,
			});
			dispatch("validate", markers);
		});
	}

	onMount(() => {
		editor = monaco.editor.create(editorElement, {
			minimap: { enabled: false },
			tabSize: 2,
			overviewRulerLanes: 0,
			scrollbar: {
				verticalScrollbarSize: 4,
				horizontalScrollbarSize: 4,
				useShadows: false,
			},
			scrollBeyondLastLine: false,
			fontSize: 16,
			language: "json",
			value,
			automaticLayout: true,
		});

		addOnChangeHandler(editor);
		addOnValidateHandler(editor);

		return () => {
			editor.dispose();
		};
	});

	afterUpdate(() => {
		editor.setValue(value);
	});
</script>

<div class="w-full h-full" bind:this={editorElement} />
