import {
  type Store,
  useSelector,
  useStore,
  useStoreInput,
} from "dn-react-input";
import { useEffect } from "react";

type FormState = {
  render: number;
  role: string;
  email: string;
  password: string;
  passwordConfirm: string;
  agree: boolean;
  description: string;
  date: string;
  time: string;
  favoriteColor?: string;
  createdAt: Date;
  week: string;
  month: string;
  search: string;
  range: number;
  name: string[];
};

export default function App() {
  const store = useStore<FormState>({
    render: 0,
    role: "user",
    email: "ohjinsu98@icloud.com",
    password: "",
    passwordConfirm: "",
    agree: false,
    description: "",
    date: "2024-01-01",
    time: "12:00",
    favoriteColor: "#ff0000",
    createdAt: new Date(),
    week: "2024-W01",
    month: "2024-01",
    search: "",
    range: 50,
    name: ["oh", "jinsu"],
  });

  const storeInput = useStoreInput(store);

  const submit = async () => {
    const state = store.state;

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: state.email,
        password: state.password,
      }),
    });

    if (!res.ok) {
      store.dispatch((state) => {
        state.description = "로그인에 실패했습니다.";

        state.agree = false;
      });
    }
  };

  useEffect(() => {
    store.dispatch((state) => {
      state.render += 1;
    });
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        submit();
      }}
    >
      <storeInput.input type="email" name="email" />
      <storeInput.input type="password" name="password" />
      <storeInput.input type="password" name="passwordConfirm" />
      <storeInput.select name="role">
        <option value="">선택하세요</option>
        <option value="admin">관리자</option>
        <option value="user">이용자</option>
      </storeInput.select>
      <storeInput.input
        type="text"
        name="name"
        placeholder="lastName"
        stringify={(value) => value[0]}
        dispatch={(state, value) => {
          state[0] = value;
        }}
      />
      <storeInput.input
        type="text"
        name="name"
        placeholder="firstName"
        stringify={(value) => value[1]}
        dispatch={(state, value) => {
          state[1] = value;
        }}
      />
      <storeInput.input type="checkbox" name="agree" />
      <storeInput.input type="radio" name="role" value="admin" />
      <storeInput.input type="radio" name="role" value="user" />
      <storeInput.input type="date" name="date" />
      <storeInput.input type="time" name="time" />
      <storeInput.input type="datetime-local" name="createdAt" />
      <storeInput.input type="number" name="render" />
      <storeInput.input type="color" name="favoriteColor" />
      <storeInput.input type="week" name="week" />
      <storeInput.input type="month" name="month" />
      <storeInput.input type="search" name="search" />
      <storeInput.input type="range" name="range" />
      <storeInput.textarea name="description" />
      <ToggleSwitch store={store} />
      <button type="submit">Submit</button>
      <StatePreview store={store} />
    </form>
  );
}

function StatePreview({ store }: { store: Store<FormState> }) {
  const state = useSelector(store, (state) => state);

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
}

function ToggleSwitch({ store }: { store: Store<FormState> }) {
  const agree = useSelector(store, (state) => state.agree);

  return (
    <button
      type="button"
      onClick={() => {
        store.dispatch((state) => {
          state.agree = !state.agree;
        });
      }}
    >
      {agree ? "ON" : "OFF"}
    </button>
  );
}
