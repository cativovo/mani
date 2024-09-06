import debounce from "@/lib/debounce";
import { PartialJQFlags } from "@/lib/generateJQFlags";
import { main } from "@wails/go/models";
import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import CopyButton from "./CopyButton";
import { Checkbox } from "./shadcn/checkbox";
import { Textarea } from "./shadcn/textarea";

type Props = {
  onQueryChange(filter: string): void | Promise<void>;
  onFlagChange(enabledFlags: PartialJQFlags): void | Promise<void>;
};

export type JQQueryRef = {
  setFlag(key: keyof main.JQFlags, checked: boolean): void;
};

type FlagData = {
  label: string;
  flag: string;
};

const flags: Record<keyof main.JQFlags, FlagData> = {
  compact: {
    label: "Compact",
    flag: "-c",
  },
  raw: {
    label: "Raw",
    flag: "-r",
  },
  slurp: {
    label: "Slurp",
    flag: "-s",
  },
};

function getToCopy(query: string, enabledFlags: PartialJQFlags): string {
  const result = Object.entries(enabledFlags)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => flags[key as keyof main.JQFlags].flag);

  result.push(`"${query}"`);

  return result.join(" ");
}

const JQQuery = forwardRef<JQQueryRef, Props>((props, ref) => {
  const [query, setQuery] = useState("");
  const [enabledFlags, setEnabledFlags] = useState<PartialJQFlags>({});
  const debouncedQueryChange = useCallback(debounce(props.onQueryChange), [
    props.onQueryChange,
  ]);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setQuery(e.target.value);
    debouncedQueryChange(e.target.value || ".");
  }

  function handleFlagChange(flag: keyof main.JQFlags) {
    return (checked: boolean) => {
      const newFlags = { ...enabledFlags, [flag]: checked };
      setEnabledFlags(newFlags);
      props.onFlagChange(newFlags);
    };
  }

  useImperativeHandle(ref, () => ({
    setFlag: (flag, checked) => {
      setEnabledFlags((prev) => ({ ...prev, [flag]: checked }));
    },
  }));

  return (
    <div className="relative group h-full p-2">
      <CopyButton
        toCopy={() => getToCopy(query || ".", enabledFlags)}
        className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity top-2 right-4"
      />
      <Textarea
        className="resize-none h-3/4"
        placeholder="your query here"
        onChange={handleChange}
        value={query}
      />
      <div className="h-1/4 flex items-center gap-2">
        {Object.entries(flags).map(([flag, flagData]) => (
          <div className="flex items-center space-x-2" key={flag}>
            <Checkbox
              id={flag}
              onCheckedChange={handleFlagChange(flag as keyof main.JQFlags)}
              checked={!!enabledFlags[flag as keyof main.JQFlags]}
            />
            <label
              htmlFor={flag}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {`${flagData.label} (${flagData.flag})`}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
});

export default JQQuery;
