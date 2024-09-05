import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import "highlight.js/styles/vs.min.css";
import { memo } from "react";

hljs.registerLanguage("json", json);

type Props = {
  json: string;
};

// https://github.com/highlightjs/highlight.js/issues/925
function JSONHighlighter(props: Props) {
  const highlighted = hljs.highlight(props.json, { language: "json" });

  return (
    <pre>
      <code dangerouslySetInnerHTML={{ __html: highlighted.value }} />
    </pre>
  );
}

export default memo(JSONHighlighter);
