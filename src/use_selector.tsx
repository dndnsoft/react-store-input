import { useState } from "react";
import type { Store } from "./use_store";
import { useSubscribe } from "./use_subscribe";

export function useSelector<T>(store: Store<T>, selector: (state: T) => any) {
  const [state, setState] = useState(selector(store.state));

  useSubscribe(store, (state) => setState(selector(state)));

  return state;
}
