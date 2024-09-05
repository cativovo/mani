import JSONHighlighter from "@/components/JSONHighlighter";
import { ScrollArea, ScrollBar } from "@/components/shadcn/scroll-area";
import { Textarea } from "@/components/shadcn/textarea";
import debounce from "@/lib/debounce";
import { Editor } from "@monaco-editor/react";
import { Query } from "@wails/go/main/App";
import { ChangeEvent, useState } from "react";
import "./App.css";

const editorOptions = {
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  scrollbar: {
    verticalScrollbarSize: 6,
    horizontalScrollbarSize: 6,
    useShadows: false,
  },
};

function App() {
  const [json, setJson] = useState("// insert here");
  const [jqResult, setJQResult] = useState("");

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
        }
      };

      reader.readAsText(file);
    }
  }

  function handleEditorChange(v?: string) {
    setJson(v ?? "");
  }

  async function handleFilterChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const filter = e.target.value || ".";
    const result = await Query(json, filter);
    setJQResult(formatJson(result));
  }

  const debouncedHandleFilterChange = debounce(handleFilterChange);

  return (
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
      <div className="flex h-[calc(100%-theme(space.14))] py-2">
        <div className="w-[50vw] px-2">
          <Editor
            defaultLanguage="json"
            value={json}
            onChange={handleEditorChange}
            onValidate={console.log}
            options={editorOptions}
            className="border py-2"
          />
        </div>
        <div className="w-[50vw] h-full px-2 flex flex-col gap-2">
          <Textarea
            className="resize-none h-24"
            placeholder="your query here"
            onChange={debouncedHandleFilterChange}
          />
          <ScrollArea className="w-full h-[calc(100%-theme(space.24))] px-2 py-4 border">
            <JSONHighlighter json={jqResult} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default App;
