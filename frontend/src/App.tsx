import CopyButton from "@/components/CopyButton";
import JQQuery from "@/components/JQQuery";
import JSONHighlighter from "@/components/JSONHighlighter";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/shadcn/resizable";
import { ScrollArea, ScrollBar } from "@/components/shadcn/scroll-area";
import { Toaster } from "@/components/shadcn/sonner";
import formatJson from "@/lib/formatJson";
import generateJQFlags, { PartialJQFlags } from "@/lib/generateJQFlags";
import { Editor } from "@monaco-editor/react";
import { Query } from "@wails/go/main/App";
import { main } from "@wails/go/models";
import { ChangeEvent, useDeferredValue, useRef, useState } from "react";
import "./App.css";

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
  const jqFlagsRef = useRef<PartialJQFlags>({});
  const queryStringRef = useRef(".");

  function handleEditorChange(v?: string) {
    setJson(v ?? "");
  }

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContents = e.target?.result;
        if (typeof fileContents === "string") {
          setJson(formatJson(fileContents));
          const result = await Query(
            fileContents,
            queryStringRef.current,
            generateJQFlags(jqFlagsRef.current),
          );
          setJQResult(result);
        }
      };

      reader.readAsText(file);
    }
  }

  async function handleQueryChange(queryString: string) {
    const result = await Query(
      json,
      queryString,
      generateJQFlags(jqFlagsRef.current),
    );
    setJQResult(result);
    queryStringRef.current = queryString;
  }

  async function handleFlagChange(flag: keyof main.JQFlags, value: boolean) {
    jqFlagsRef.current[flag] = value;
    const result = await Query(
      json,
      queryStringRef.current,
      generateJQFlags(jqFlagsRef.current),
    );
    setJQResult(result);
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
                  <JQQuery
                    onQueryChange={handleQueryChange}
                    onFlagChange={handleFlagChange}
                  />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={80} className="p-2">
                  <ScrollArea className="p-2 relative group h-full">
                    <CopyButton
                      toCopy={() => jqResult}
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
