import type { main } from "$wails/go/models";
import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";

export enum ContextKey {
  Query = "query",
  Flags = "flags",
}

export type Context = {
  [ContextKey.Query]: Writable<string>;
  [ContextKey.Flags]: Writable<main.JQFlags>;
};

export function setJQPlaygroundContext() {
  const defaultQuery = ".";
  const defaultFlags: main.JQFlags = {
    compact: false,
    raw: false,
    slurp: false,
  };

  const query = writable<string>(defaultQuery);
  const flags = writable<main.JQFlags>(defaultFlags);

  setContext(ContextKey.Query, query);
  setContext(ContextKey.Flags, flags);
}

export function getQuery(): Context[ContextKey.Query] {
  return getContext(ContextKey.Query);
}

export function getFlags(): Context[ContextKey.Flags] {
  return getContext(ContextKey.Flags);
}
