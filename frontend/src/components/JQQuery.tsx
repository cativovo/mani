import debounce from "@/lib/debounce";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import CopyButton from "./CopyButton";
import { Textarea } from "./shadcn/textarea";
import { main } from "@wails/go/models";
import { Checkbox } from "./shadcn/checkbox";

type Props = {
  onQueryChange(filter: string): void | Promise<void>;
  onFlagChange(flag: keyof main.JQFlags, value: boolean): void | Promise<void>;
};

type FlagData = {
  label: string;
  flag: string;
  enabled: boolean;
};

const flags: Record<keyof main.JQFlags, FlagData> = {
  compact: {
    label: "Compact",
    flag: "-c",
    enabled: false,
  },
};

function getToCopy(query: string, jqFlags: typeof flags): string {
  if (query === "") {
    return "";
  }

  let result: string[] = [];

  Object.values(jqFlags).forEach((flagData) => {
    if (flagData.enabled) {
      result.push(flagData.flag);
    }
  });

  result.push(`"${query}"`);

  return result.join(" ");
}

function JQQuery(props: Props) {
  const [value, setValue] = useState("");
  const jqFlags = useRef<typeof flags>(flags);
  const debouncedQueryChange = useCallback(debounce(props.onQueryChange), [
    props.onQueryChange,
  ]);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    debouncedQueryChange(e.target.value || ".");
  }

  function handleFlagChange(flag: keyof main.JQFlags) {
    return (value: boolean) => {
      jqFlags.current[flag].enabled = value;
      props.onFlagChange(flag, value);
    };
  }

  return (
    <div className="relative group h-full p-2">
      <CopyButton
        toCopy={() => getToCopy(value, jqFlags.current)}
        className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity top-2 right-4"
      />
      <Textarea
        className="resize-none h-3/4"
        placeholder="your query here"
        onChange={handleChange}
        value={value}
      />
      <div className="h-1/4 flex items-center">
        {Object.entries(flags).map(([flag, flagData]) => (
          <div className="flex items-center space-x-2" key={flag}>
            <Checkbox
              id="terms"
              onCheckedChange={handleFlagChange(flag as keyof main.JQFlags)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {`${flagData.label} (${flagData.flag})`}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JQQuery;
