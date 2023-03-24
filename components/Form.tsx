import React, { FormEvent, useRef } from "react";

const add = async (type: string, value: string) => {
  try {
    const body: { reminder?: string; prompt?: string } = {};

    if (type === "reminders") {
      body.reminder = value;
    }

    if (type === "prompts") {
      body.prompt = value;
    }

    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: process.env.NEXT_PUBLIC_API_KEY as string,
      },
      body: JSON.stringify(body),
    });

    return true;
  } catch (err) {
    console.log(err);
  }
};

type Props = {
  onDone: () => Promise<void>;
};
const Form: React.FC<Props> = ({ onDone }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (inputRef.current && selectRef.current) {
      const res = await add(selectRef.current.value, inputRef.current.value);
      if (res) {
        inputRef.current.value = "";
      }
    }
    await onDone();
  };

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <input ref={inputRef} />
      <select ref={selectRef}>
        <option value="reminders">Reminders</option>
        <option value="prompts">Prompts</option>
      </select>
      <button>Submit</button>
    </form>
  );
};

export default Form;
