import {
  useCallback,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import type { Store } from "./use_store";
import React from "react";
import { useStoreInputProps } from "./use_store_input_props";

export function useStoreInput<T>(store: Store<T>) {
  type StoreInputProps<
    TElement extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  > = Omit<
    TElement extends HTMLInputElement
      ? InputHTMLAttributes<HTMLInputElement>
      : TElement extends HTMLSelectElement
      ? SelectHTMLAttributes<HTMLSelectElement>
      : TextareaHTMLAttributes<HTMLTextAreaElement>,
    "name"
  > & { name: keyof T };

  const input = useCallback(function Component(
    props: StoreInputProps<HTMLInputElement>
  ) {
    const storeProps = useStoreInputProps(store, props);

    return <input {...props} {...storeProps} />;
  },
  []);

  const select = useCallback(function Component(
    props: StoreInputProps<HTMLSelectElement>
  ) {
    const storeProps = useStoreInputProps(store, props);

    return <select {...props} {...storeProps} />;
  },
  []);

  const textarea = useCallback(function Component(
    props: StoreInputProps<HTMLTextAreaElement>
  ) {
    const storeProps = useStoreInputProps(store, props);

    return <textarea {...props} {...storeProps} />;
  },
  []);

  return {
    input,
    select,
    textarea,
  };
}
