import { shikiToMonaco } from "@shikijs/monaco";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import { createHighlighter } from "shiki";

self.MonacoEnvironment = {
  getWorker: function (_: any, label: string) {
    if (label === "json") {
      return new jsonWorker();
    }
    return new editorWorker();
  },
};

(async () => {
  const languages = ["json"];

  const highlighter = await createHighlighter({
    themes: ["github-light-default"],
    langs: languages,
  });

  languages.forEach((lang) => {
    monaco.languages.register({ id: lang });
  });

  shikiToMonaco(highlighter, monaco);
})();
