<script lang="ts">
	import { ChevronDown, ChevronUp } from "lucide-svelte";
	import * as monaco from "monaco-editor";
	import { onMount } from "svelte";
	import { Button } from "./ui/button";
	import { ScrollArea } from "./ui/scroll-area";

	export let value: string = "";
	export function setValue(value: string) {
		editor?.setValue(value);
	}

	let editorElement: HTMLDivElement;
	let editor: monaco.editor.IStandaloneCodeEditor;

	let isDiagnosticsOpen = false;
	let diagnostics: Array<monaco.editor.IMarker> = [];

	function toggleDrawer() {
		isDiagnosticsOpen = !isDiagnosticsOpen;
	}

	function addOnChangeHandler(ed: monaco.editor.IStandaloneCodeEditor) {
		ed.onDidChangeModelContent(async () => {
			value = ed.getValue();
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

			diagnostics = monaco.editor.getModelMarkers({
				resource: editorUri,
			});

			if (isDiagnosticsOpen && diagnostics.length === 0) {
				isDiagnosticsOpen = false;
			}
		});
	}

	function goToLine(marker: monaco.editor.IMarker) {
		editor.focus();
		editor.revealLine(marker.endLineNumber);
		editor.setPosition({
			column: marker.endColumn,
			lineNumber: marker.endLineNumber,
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
			theme: "github-light-default",
		});

		addOnChangeHandler(editor);
		addOnValidateHandler(editor);

		return () => {
			editor.dispose();
		};
	});
</script>

<div class="flex overflow-hidden relative flex-col h-full">
	<div
		class={isDiagnosticsOpen ? "h-3/4" : "h-full"}
		bind:this={editorElement}
	/>
	{#if diagnostics.length > 0}
		{#if !isDiagnosticsOpen}
			<Button
				variant="outline"
				size="icon"
				class="absolute right-0 bottom-0"
				on:click={toggleDrawer}
			>
				<ChevronDown class="text-red-400" />
			</Button>
		{:else}
			<div class="relative h-1/4 border-t">
				<Button
					variant="outline"
					size="icon"
					on:click={toggleDrawer}
					class="absolute right-0 -top-8"
				>
					<ChevronUp class="text-red-400" />
				</Button>
				<ScrollArea orientation="both" class="">
					<ul class="p-1 pt-4">
						{#each diagnostics as diagnostic}
							<li class="w-full text-red-600 whitespace-nowrap border-b">
								<Button
									on:click={() => goToLine(diagnostic)}
									variant="ghost"
									class="block w-full text-justify hover:text-inherit"
								>
									{`${diagnostic.message} at line ${diagnostic.endLineNumber}, column ${diagnostic.endColumn}`}
								</Button>
							</li>
						{/each}
					</ul>
				</ScrollArea>
			</div>
		{/if}
	{/if}
</div>
