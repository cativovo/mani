import { ChangeEvent, useCallback, useState } from "react";
import { Textarea } from "./shadcn/textarea";
import debounce from "@/lib/debounce";
import CopyButton from "./CopyButton";

type Props = {
  onFilterChange(filter: string): void;
};

function JQFilter(props: Props) {
  const [value, setValue] = useState("");
  const debouncedFilterChange = useCallback(debounce(props.onFilterChange), [
    props.onFilterChange,
  ]);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    debouncedFilterChange(e.target.value || ".");
  }

  return (
    <div className="h-24 relative group">
      <CopyButton
        toCopy={value}
        className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity top-2 right-4"
      />
      <Textarea
        className="resize-none"
        placeholder="your query here"
        onChange={handleChange}
        value={value}
      />
    </div>
  );
}

export default JQFilter;
