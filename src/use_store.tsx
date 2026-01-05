import { useMemo, useRef } from "react";
import { produce } from "immer";

export type Store<T> = ReturnType<typeof useStore<T>>;

export function useStore<T>(initialState: T) {
  const stateRef = useRef<T>(initialState);

  const subscribers = useMemo<((state: T) => void)[]>(() => [], []);

  const dispatch = (recipe: (draft: T) => void) => {
    stateRef.current = produce(stateRef.current, recipe);

    notify();
  };

  const subscribe = (listener: (state: T) => void) => {
    subscribers.push(listener);

    return () => {
      const index = subscribers.indexOf(listener);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    };
  };

  const notify = () => {
    for (const listener of subscribers) {
      listener(stateRef.current);
    }
  };

  return {
    get state() {
      return stateRef.current;
    },
    dispatch,
    subscribe,
  };
}
