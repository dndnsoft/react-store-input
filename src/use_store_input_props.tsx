import {
  useEffect,
  useRef,
  type ChangeEventHandler,
  type HTMLInputTypeAttribute,
} from "react";
import type { Store } from "./use_store";
import { format } from "date-fns";

type InputType = HTMLInputTypeAttribute;

export function useStoreInputProps<TElement, T>(
  store: Store<T>,
  props: {
    name: keyof T;
    type?: InputType;
    defaultValue?: string | number | readonly string[];
    defaultChecked?: boolean;
    onChange?: ChangeEventHandler<TElement>;
  }
) {
  const toInputValue = (
    value: unknown,
    {
      type,
    }: {
      type?: InputType;
    }
  ) => {
    if (value === undefined || value === null) {
      return "";
    }

    if (type === "number" || type === "range") {
      return Number.isNaN(value) ? "" : String(value);
    }

    if (type === "datetime-local") {
      if (value instanceof Date) {
        return format(value, "yyyy-MM-dd'T'HH:mm:ss");
      }
    }

    return String(value);
  };

  const getDefaultValue = ({
    defaultValue,
    name,
    type,
  }: {
    defaultValue?: string | number | readonly string[];
    name: keyof T;
    type?: InputType;
  }) => {
    if (defaultValue !== undefined) {
      return defaultValue;
    }

    if (type === "checkbox" || type === "radio") {
      return undefined;
    }

    return toInputValue(store.state[name], {
      type,
    });
  };

  const toInputChecked = (
    value: unknown,
    props: {
      type?: InputType;
      value?: string | number | readonly string[];
    }
  ) => {
    if (props.type === "radio") {
      return value !== undefined && value === props.value;
    }

    return Boolean(value);
  };

  const getDefaultChecked = ({
    defaultChecked,
    name,
    type,
    value,
  }: {
    defaultChecked?: boolean;
    name: keyof T;
    type?: InputType;
    value?: string | number | readonly string[];
  }) => {
    if (defaultChecked) {
      return defaultChecked;
    }

    if (type !== "checkbox" && type !== "radio") {
      return undefined;
    }

    return toInputChecked(store.state[name], { type, value });
  };

  function useSubscriptionRef<TElement>({
    name,
    type,
  }: {
    name: keyof T;
    type?: InputType;
  }) {
    const ref = useRef<TElement>(null);

    useEffect(() => {
      return store.subscribe((state) => {
        const input = ref.current as unknown as HTMLInputElement;

        if (!input) {
          return;
        }

        if (type === "checkbox" || type === "radio") {
          input.checked = toInputChecked(state[name as never], {
            type,
            value: input.value,
          });
        } else {
          input.value = toInputValue(state[name as never], {
            type,
          });
        }
      });
    }, []);

    return ref;
  }

  function toStateValue(value: string, { type }: { type?: InputType }) {
    if (type === "number" || type === "range") {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }

    if (type === "datetime-local") {
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    }

    return value;
  }

  function createChangeEventHandler<TElement>({
    name,
    type,
    onChange,
  }: {
    name: keyof T;
    type?: InputType;
    onChange?: ChangeEventHandler<TElement>;
  }): ChangeEventHandler<TElement> {
    return (e) => {
      const target = e.target as unknown as HTMLInputElement;

      if (type === "checkbox") {
        store.dispatch((state) => {
          state[name] = target.checked as never;
        });
      } else {
        store.dispatch((state) => {
          state[name] = toStateValue(target.value, {
            type,
          }) as never;
        });
      }

      onChange?.(e);
    };
  }

  const ref = useSubscriptionRef<TElement>(props);

  const name = String(props.name);

  const defaultValue = getDefaultValue(props);

  const defaultChecked = getDefaultChecked(props);

  const onChange = createChangeEventHandler<TElement>(props);

  return {
    ref,
    name,
    defaultValue,
    defaultChecked,
    onChange,
  };
}
