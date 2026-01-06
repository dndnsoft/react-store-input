import { useState } from "react";
import type { Store } from "./use_store";
import { useSubscribe } from "./use_subscribe";

export function useSelector<TState, TSelected>(store: Store<TState>, selector: (state: TState) => TSelected, compare: (a: TSelected, b: TSelected) => boolean = (a, b) => a === b): TSelected {
  const [state, setState] = useState(selector(store.state));

  useSubscribe(store, (newState) => {
    const result = selector(newState);

    if (compare(state, result)) {
      return;
    }

    setState(result);
  });

  return state;
}
