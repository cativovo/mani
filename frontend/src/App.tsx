import { Editor } from "@monaco-editor/react";
import { ChangeEvent, useState } from "react";
import "./App.css";

function App() {
  const [json, setJson] = useState("// insert here");

  function formatJson(input: string): string {
    try {
      const parsed = JSON.parse(input);
      return JSON.stringify(parsed, null, 2);
    } catch (err) {
      console.error(err);
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

  return (
    <>
      <label htmlFor="upload">
        <span>upload file</span>
        <input type="file" id="upload" accept="json" onChange={handleUpload} />
      </label>
      <div className="h-[90vh] w-screen">
        <Editor
          defaultLanguage="json"
          value={json}
          onChange={handleEditorChange}
          onValidate={console.log}
        />
      </div>
    </>
  );
}

export default App;
