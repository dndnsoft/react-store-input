import { useEffect } from "react";
import type { Store } from "./use_store";

export function useSubscribe<T>(
  store: Store<T>,
  subscriber: (state: T) => void
) {
  useEffect(() => {
    const unsubscribe = store.subscribe(subscriber);

    return () => {
      unsubscribe();
    };
  }, [store]);
}
