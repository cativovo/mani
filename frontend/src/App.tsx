import CopyButton from "@/components/CopyButton";
import JQQuery, { JQQueryRef } from "@/components/JQQuery";
import JSONHighlighter from "@/components/JSONHighlighter";
import { Button } from "@/components/shadcn/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/shadcn/resizable";
import { ScrollArea, ScrollBar } from "@/components/shadcn/scroll-area";
import { Toaster } from "@/components/shadcn/sonner";
import formatJson from "@/lib/formatJson";
import generateJQFlags, { PartialJQFlags } from "@/lib/generateJQFlags";
import readFileContents from "@/lib/readFileContents";
import { Editor } from "@monaco-editor/react";
import { GetInitialContent, Query } from "@wails/go/main/App";
import { CircleX, FolderOpenDot, X } from "lucide-react";
import { editor } from "monaco-editor";
import {
  ChangeEvent,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import "./App.css";

const editorOptions: editor.IStandaloneEditorConstructionOptions = {
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
};

function App() {
  const [json, setJson] = useState("");
  const [jqResult, setJQResult] = useState("");
  const deferredJQResult = useDeferredValue(jqResult);
  const jqFlagsRef = useRef<PartialJQFlags>({});
  const queryStringRef = useRef(".");
  const jqQueryRef = useRef<JQQueryRef>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [editorErrors, setEditorErrors] = useState<string[]>([]);

  function handleEditorChange(v?: string) {
    setJson(v ?? "");
  }

  function handleEditorValidate(markers: editor.IMarker[]) {
    const errors = markers.map(
      (marker) =>
        `${marker.message} at line ${marker.endLineNumber}, column ${marker.endColumn}`,
    );
    if (errors.length === 0) {
      toast.dismiss();
    }
    setEditorErrors(errors);
  }

  function showEditorErrors() {
    toast.dismiss();

    editorErrors.forEach((error) => {
      toast.error(error, {
        cancel: {
          label: <X className="h-4 w-4" />,
          onClick: () => {},
        },
        cancelButtonStyle: {
          backgroundColor: "inherit",
          color: "inherit",
        },
        duration: Infinity,
      });
    });
  }

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const promises = [...(e.target.files ?? [])].map(readFileContents);
    const results = await Promise.all(promises);
    const slurp = jqFlagsRef.current.slurp || results.length > 1;
    const fileContents = results.join("");

    setJson(formatJson(fileContents));
    jqQueryRef.current?.setFlag("slurp", slurp);
    const result = await Query(
      fileContents,
      queryStringRef.current,
      generateJQFlags({ ...jqFlagsRef.current, slurp }),
    );

    setJQResult(result);
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

  async function handleFlagChange(enabledFlags: PartialJQFlags) {
    jqFlagsRef.current = enabledFlags;
    const result = await Query(
      json,
      queryStringRef.current,
      generateJQFlags(jqFlagsRef.current),
    );
    setJQResult(result);
  }

  function openFile() {
    inputFileRef.current?.click();
  }

  useEffect(() => {
    (async () => {
      const initialContent = await GetInitialContent();
      setJson(formatJson(initialContent));
    })();
  }, []);

  return (
    <>
      <div className="h-screen">
        <div className="h-14 bg-gray-100 flex items-center px-2 gap-2">
          <input
            ref={inputFileRef}
            type="file"
            id="upload"
            accept="application/json"
            onChange={handleUpload}
            multiple
            hidden
          />
          <Button variant="outline" className="space-x-1" onClick={openFile}>
            <FolderOpenDot className="text-gray-500" />
            <span>Open file(s)</span>
          </Button>
          {editorErrors.length > 0 && (
            <Button
              variant="destructive"
              className="space-x-1"
              onClick={showEditorErrors}
            >
              <CircleX />
              <span>Show error(s)</span>
            </Button>
          )}
        </div>
        <div className="h-[calc(100%-theme(space.14))]">
          <ResizablePanelGroup direction="horizontal" className="py-2">
            <ResizablePanel defaultSize={50} className="px-2">
              <Editor
                defaultLanguage="json"
                value={json}
                onChange={handleEditorChange}
                onValidate={handleEditorValidate}
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
                    ref={jqQueryRef}
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
