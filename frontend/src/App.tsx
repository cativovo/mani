import CopyButton from "@/components/CopyButton";
import JQFilter from "@/components/JQFilter";
import JSONHighlighter from "@/components/JSONHighlighter";
import { ScrollArea, ScrollBar } from "@/components/shadcn/scroll-area";
import { Toaster } from "@/components/shadcn/sonner";
import { Editor } from "@monaco-editor/react";
import { Query } from "@wails/go/main/App";
import { ChangeEvent, useDeferredValue, useState } from "react";
import "./App.css";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/shadcn/resizable";

const editorOptions = {
  minimap: { enabled: false },
  tabSize: 2,
  overviewRulerLanes: 0,
  scrollbar: {
    verticalScrollbarSize: 4,
    horizontalScrollbarSize: 4,
    useShadows: false,
  },
  scrollBeyondLastLine: false,
};

function App() {
  const [json, setJson] = useState("// insert here");
  const [jqResult, setJQResult] = useState("");
  const deferredJQResult = useDeferredValue(jqResult);

  function formatJson(input: string): string {
    try {
      const parsed = JSON.parse(input);
      return JSON.stringify(parsed, null, 2);
    } catch (err) {
      return input;
    }
  }

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setJson(formatJson(result));
          setJQResult("");
        }
      };

      reader.readAsText(file);
    }
  }

  function handleEditorChange(v?: string) {
    setJson(v ?? "");
  }

  async function handleFilterChange(filter: string) {
    const result = await Query(json, filter);
    setJQResult(formatJson(result));
  }

  return (
    <>
      <div className="h-screen">
        <div className="h-14 bg-red-600">
          <label htmlFor="upload">
            <span>upload file</span>
            <input
              type="file"
              id="upload"
              accept="json"
              onChange={handleUpload}
            />
          </label>
        </div>
        <div className="h-[calc(100%-theme(space.14))]">
          <ResizablePanelGroup direction="horizontal" className="py-2">
            <ResizablePanel defaultSize={50} className="px-2">
              <Editor
                defaultLanguage="json"
                value={json}
                onChange={handleEditorChange}
                onValidate={console.log}
                options={editorOptions}
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50} className="flex flex-col gap-2">
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={20}>
                  <JQFilter onFilterChange={handleFilterChange} />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={80} className="p-2">
                  <ScrollArea className="p-2 relative group h-full">
                    <CopyButton
                      toCopy={jqResult}
                      className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity top-2 right-4"
                    />
                    <JSONHighlighter json={deferredJQResult} />
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default App;
