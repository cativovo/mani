import debounce from "@/lib/debounce";
import { ChangeEvent, useCallback, useState } from "react";
import CopyButton from "./CopyButton";
import { Textarea } from "./shadcn/textarea";

type Props = {
  onQueryChange(filter: string): void;
};

function JQQuery(props: Props) {
  const [value, setValue] = useState("");
  const debouncedQueryChange = useCallback(debounce(props.onQueryChange), [
    props.onQueryChange,
  ]);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    debouncedQueryChange(e.target.value || ".");
  }

  return (
    <div className="relative group h-full p-2">
      <CopyButton
        toCopy={value}
        className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity top-2 right-4"
      />
      <Textarea
        className="resize-none h-full"
        placeholder="your query here"
        onChange={handleChange}
        value={value}
      />
    </div>
  );
}

export default JQQuery;
