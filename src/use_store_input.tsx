import {
  useCallback,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import type { Store } from "./use_store";
import React from "react";
import { useStoreInputProps } from "./use_store_input_props";

type StoreInputProps<
  TElement extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, TState
> = Omit<
  TElement extends HTMLInputElement
  ? InputHTMLAttributes<HTMLInputElement>
  : TElement extends HTMLSelectElement
  ? SelectHTMLAttributes<HTMLSelectElement>
  : TextareaHTMLAttributes<HTMLTextAreaElement>,
  "name"
> & { name: keyof TState };

export function useStoreInput<TState>(store: Store<TState>) {
  const input: React.FC<StoreInputProps<HTMLInputElement, TState>> = useCallback(function Component(
    props
  ) {
    return <Input store={store} {...props} />;
  },
    []);

  const select: React.FC<StoreInputProps<HTMLSelectElement, TState>> = useCallback(function Component(
    props
  ) {
    return <Select store={store} {...props} />;
  },
    []);

  const textarea: React.FC<StoreInputProps<HTMLTextAreaElement, TState>> = useCallback(function Component(
    props
  ) {
    return <Textarea store={store} {...props} />;
  }, []);

  return {
    input,
    select,
    textarea,
  };
}

export type StoreInputPropsWithStore<
  TElement extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, TState
> = StoreInputProps<TElement, TState> & { store: Store<TState> };

export function Input<TState>({ store, ...props }: StoreInputPropsWithStore<HTMLInputElement, TState>) {
  const storeProps = useStoreInputProps(store, props);

  return <input {...props} {...storeProps} />;
}

export function Select<TState>({ store, ...props }: StoreInputPropsWithStore<HTMLSelectElement, TState>) {
  const storeProps = useStoreInputProps(store, props);

  return <select {...props} {...storeProps} />;
}

export function Textarea<TState>({ store, ...props }: StoreInputPropsWithStore<HTMLTextAreaElement, TState>) {
  const storeProps = useStoreInputProps(store, props);

  return <textarea {...props} {...storeProps} />;
}
