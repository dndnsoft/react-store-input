import {
  useEffect,
  useId,
  useMemo,
  useRef,
  type ChangeEventHandler,
  type HTMLInputTypeAttribute,
} from "react";
import type { Store } from "./use_store";
import { format } from "date-fns";

type InputType = HTMLInputTypeAttribute;

type InputProps<TElement, TState> = {
  name: keyof TState;
  type?: InputType;
  defaultValue?: string | number | readonly string[];
  value?: string | number | readonly string[];
  defaultChecked?: boolean;
  onChange?: ChangeEventHandler<TElement>;
}

export function useStoreInputProps<TElement, TState>(
  store: Store<TState>,
  props: InputProps<TElement, TState>
) {
  const toInputValue = (
    value: unknown,
  ) => {
    if (value === undefined || value === null) {
      return "";
    }

    if (props.type === "datetime-local") {
      if (value instanceof Date) {
        return format(value, "yyyy-MM-dd'T'HH:mm:ss");
      }

      if (typeof value === "string") {
        return toInputValue(new Date(value));
      }
    }

    return String(value);
  };

  const getDefaultValue = () => {
    if (props.defaultValue !== undefined) {
      return props.defaultValue;
    }

    if (props.type === "checkbox" || props.type === "radio") {
      return undefined;
    }

    return toInputValue(store.state[props.name]);
  };

  const toInputChecked = (
    value: unknown,
  ) => {
    if (props.type === "radio") {
      return value !== undefined && value === props.value;
    }

    return Boolean(value);
  };

  const getDefaultChecked = () => {
    if (props.defaultChecked) {
      return props.defaultChecked;
    }

    if (props.type !== "checkbox" && props.type !== "radio") {
      return undefined;
    }

    return toInputChecked(store.state[props.name]);
  };

  function useSubscriptionRef<TElement>() {
    const ref = useRef<TElement>(null);

    useEffect(() => {
      return store.subscribe((state, key) => {
        if (key === dispatchKey) {
          return;
        }

        const input = ref.current as unknown as HTMLInputElement;

        if (!input) {
          return;
        }

        if (props.type === "checkbox" || props.type === "radio") {
          const checked = toInputChecked(state[props.name as never])

          if (input.checked === checked) {
            return;
          }

          input.checked = checked;
        } else {
          const value = toInputValue(state[props.name as never]);

          if (input.value === value) {
            return;
          }

          input.value = value;
        }

        const event = new Event("input", { bubbles: true });

        input.dispatchEvent(event);
      });
    }, []);

    return ref;
  }

  function toStateValue(value: string) {
    if (typeof store.state[props.name] === "number") {
      return Number(value);
    }

    if (store.state[props.name] instanceof Date) {
      return new Date(value)
    }

    return value;
  }

  function createChangeEventHandler(): ChangeEventHandler<TElement> {
    return (e) => {
      const target = e.target as unknown as HTMLInputElement;

      if (props.type === "checkbox") {
        store.dispatch((state) => {
          state[props.name] = target.checked as never;
        }, {
          key: dispatchKey
        });
      } else {
        store.dispatch((state) => {
          state[props.name] = toStateValue(target.value) as never;
        }, {
          key: dispatchKey
        });
      }

      props.onChange?.(e);
    };
  }

  const dispatchKey = useId();

  const ref = useSubscriptionRef<TElement>();

  const name = String(props.name);

  const defaultValue = getDefaultValue();

  const defaultChecked = getDefaultChecked();

  const onChange = createChangeEventHandler();

  return {
    key: dispatchKey,
    ref,
    name,
    defaultValue,
    defaultChecked,
    onChange,
  };
}
