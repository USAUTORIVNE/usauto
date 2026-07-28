"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined,
  );

  return (
    <form
      action={action}
      className="w-full max-w-sm rounded-xs border border-ink-line bg-white p-9"
    >
      <h1 className="font-display text-4xl leading-none font-extrabold italic uppercase">
        Панель заявок
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink/60">
        Доступ лише для менеджерів. Введіть пароль.
      </p>

      <label className="mt-8 block">
        <span className="label-caps mb-2 block text-muted">Пароль</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          autoFocus
          className="w-full border-b border-ink/25 bg-transparent py-2.5 outline-none transition-colors duration-300 focus:border-accent"
        />
      </label>

      {state?.error ? (
        <p className="mt-5 border-l-2 border-red-700 bg-red-50 px-4 py-2.5 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="label-caps mt-8 w-full rounded-xs bg-ink px-6 py-4 text-bone transition-colors duration-300 hover:bg-ink-soft disabled:opacity-60"
      >
        {pending ? "Перевіряємо…" : "Увійти"}
      </button>
    </form>
  );
}
