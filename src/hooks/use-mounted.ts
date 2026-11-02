"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** Hindari hydration mismatch: false saat SSR, true setelah mount di client. */
export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
