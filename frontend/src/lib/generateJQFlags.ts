import { main } from "@wails/go/models";

export type PartialJQFlags = Partial<main.JQFlags>;

const defaultFlags: main.JQFlags = {
  compact: false,
  raw: false,
};

export default function generateJQFlags(flags?: PartialJQFlags): main.JQFlags {
  if (!flags) {
    return defaultFlags;
  }

  return { ...defaultFlags, ...flags };
}
