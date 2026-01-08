import { useId, useImperativeHandle, useRef, type Ref } from "react";
import type { Store } from "./use_store";
import { useSubscribe } from "./use_subscribe";

export type StoreControllerProps<TController, TState> = {
  ref?: Ref<TController>;
  onSubscribe: (state: TState, element: TController) => void;
  onDispatch: (state: TState, element: TController) => void;
};

export function useStoreController<TController, TState>(
  store: Store<TState>,
  props: StoreControllerProps<TController, TState>
) {
  const ref = useRef<TController>(null);

  useImperativeHandle(props.ref, () => ref.current as TController, []);

  const dispatchKey = useId();

  useSubscribe(store, (state, key) => {
    if (key === dispatchKey) {
      return;
    }

    if (!ref.current) return;

    props.onSubscribe(state, ref.current);
  });

  const onChange = () => {
    store.dispatch(
      (state) => {
        const element = ref.current;

        if (!element) return;

        props.onDispatch(state, element);
      },
      {
        key: dispatchKey,
      }
    );
  };

  return {
    ref,
    onChange,
  };
}
