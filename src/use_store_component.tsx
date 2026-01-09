import { useCallback } from "react";
import type { Store } from "./use_store";
import React from "react";
import {
  useStoreInputWithName,
  type StoreInputWithNameProps,
} from "./use_store_input_with_name";

export function useStoreComponent<TState>(store: Store<TState>) {
  const input = useCallback(function Component<
    TName extends keyof TState | undefined,
    TValue
  >(props: StoreInputWithNameProps<HTMLInputElement, TState, TName, TValue>) {
    return <Input store={store} {...props} />;
  },
  []);

  const select = useCallback(function Component<
    TName extends keyof TState | undefined,
    TValue
  >(props: StoreInputWithNameProps<HTMLSelectElement, TState, TName, TValue>) {
    return <Select store={store} {...props} />;
  },
  []);

  const textarea = useCallback(function Component<
    TName extends keyof TState | undefined,
    TValue
  >(
    props: StoreInputWithNameProps<HTMLTextAreaElement, TState, TName, TValue>
  ) {
    return <Textarea store={store} {...props} />;
  },
  []);

  return {
    input,
    select,
    textarea,
  };
}

export type StoreComponentPropsWithStore<
  TElement extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  TState,
  TName extends keyof TState | undefined,
  TValue
> = StoreInputWithNameProps<TElement, TState, TName, TValue> & {
  store: Store<TState>;
};

export function Input<TState, TName extends keyof TState | undefined, TValue>({
  store,
  getter,
  setter,
  toInputValue,
  toStateValue,
  ...props
}: StoreComponentPropsWithStore<HTMLInputElement, TState, TName, TValue>) {
  const storeProps = useStoreInputWithName(store, {
    ...props,
    getter,
    setter,
    toInputValue,
    toStateValue,
  });

  return <input {...props} {...storeProps} />;
}

export function Select<TState, TName extends keyof TState | undefined, TValue>({
  store,
  getter,
  setter,
  toInputValue,
  toStateValue,
  ...props
}: StoreComponentPropsWithStore<HTMLSelectElement, TState, TName, TValue>) {
  const storeProps = useStoreInputWithName(store, {
    ...props,
    getter,
    setter,
    toInputValue,
    toStateValue,
  });

  return <select {...props} {...storeProps} />;
}

export function Textarea<
  TState,
  TName extends keyof TState | undefined,
  TValue
>({
  store,
  getter,
  setter,
  toInputValue,
  toStateValue,
  ...props
}: StoreComponentPropsWithStore<HTMLTextAreaElement, TState, TName, TValue>) {
  const storeProps = useStoreInputWithName(store, {
    ...props,
    getter,
    setter,
    toInputValue,
    toStateValue,
  });

  return <textarea {...props} {...storeProps} />;
}
