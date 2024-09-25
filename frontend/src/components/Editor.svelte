<script lang="ts">
	import CopyButton from "$/components/CopyButton.svelte";
	import { Button } from "$/components/ui/button";
	import { ScrollArea } from "$/components/ui/scroll-area";
	import formatJson from "$/lib/format-json";
	import { cn } from "$/lib/ui-utils";
	import { DownloadJQResult } from "$wails/go/main/App";
	import { Braces, ChevronDown, ChevronUp, Save } from "lucide-svelte";
	import * as monaco from "monaco-editor";
	import { afterUpdate, onMount } from "svelte";

	export let value: string = "";
	export let options: monaco.editor.IStandaloneEditorConstructionOptions = {};

	let editorElement: HTMLDivElement;
	let editor: monaco.editor.IStandaloneCodeEditor;

	let isDiagnosticsOpen = false;
	let isCopyAlertVisible = false;
	let diagnostics: Array<monaco.editor.IMarker> = [];

	function toggleDrawer() {
		isDiagnosticsOpen = !isDiagnosticsOpen;
	}

	function addOnChangeHandler(
		ed: monaco.editor.IStandaloneCodeEditor,
	): monaco.IDisposable {
		return ed.onDidChangeModelContent(async () => {
			value = ed.getValue();
		});
	}

	function addOnValidateHandler(
		ed: monaco.editor.IStandaloneCodeEditor,
	): monaco.IDisposable {
		// https://github.com/suren-atoyan/monaco-react/blob/f7cac39fbad0f062dc66458831aaf57a7126dd40/src/Editor/Editor.tsx#L221
		return monaco.editor.onDidChangeMarkers((uris) => {
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

	function download() {
		DownloadJQResult(value);
	}

	function format() {
		value = formatJson(value);
		editor.setValue(value);
	}

	onMount(() => {
		editor = monaco.editor.create(editorElement, {
			minimap: { enabled: false },
			tabSize: 2,
			overviewRulerLanes: 0,
			scrollbar: {
				useShadows: false,
			},
			scrollBeyondLastLine: false,
			fontSize: 16,
			language: "json",
			value,
			automaticLayout: true,
			theme: "github-light-default",
			...options,
		});

		const disposables: Array<monaco.IDisposable> = [];
		if (!options.readOnly) {
			disposables.push(addOnChangeHandler(editor));
			disposables.push(addOnValidateHandler(editor));
		}

		return () => {
			disposables.forEach((d) => d.dispose());
			editor.getModel()?.dispose();
			editor.dispose();
		};
	});

	afterUpdate(() => {
		if (options.readOnly) {
			editor.setValue(value);
			return;
		}

		if (value !== editor.getValue()) {
			editor.executeEdits("", [
				{
					range: editor.getModel()!.getFullModelRange(),
					text: value,
					forceMoveMarkers: true,
				},
			]);
			editor.pushUndoStop();
		}
	});
</script>

<div class="flex overflow-hidden relative flex-col h-full">
	{#if value !== ""}
		<div
			class={cn(
				"flex absolute top-2 right-4 z-50 flex-col gap-2 p-2 transition-opacity",
				isCopyAlertVisible ? "opacity-100" : "opacity-0 hover:opacity-100",
			)}
		>
			<CopyButton
				toCopy={value}
				on:copy={(e) => (isCopyAlertVisible = e.detail)}
			/>
			<Button variant="outline" size="icon" on:click={download}>
				<Save class="text-gray-500" />
			</Button>
			<Button variant="outline" size="icon" on:click={format}>
				<Braces class="text-gray-500" />
			</Button>
		</div>
	{/if}
	<div
		class={isDiagnosticsOpen ? "h-3/4" : "h-full"}
		bind:this={editorElement}
	/>
	{#if !options.readOnly && diagnostics.length > 0}
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
