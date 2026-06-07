"use client";

import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "@/lib/actions/auth";
import { Icon } from "@/components/ui/Icon";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-on-primary py-md rounded-lg font-label-md hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
    </button>
  );
}

export function LoginForm() {
  const [errorMessage, formAction] = useFormState(authenticate, undefined);

  const inputClass =
    "w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md text-body-md";

  return (
    <form action={formAction} className="flex flex-col gap-md">
      <div className="flex flex-col gap-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="email">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue="admin@riversidetinyhouse.com"
          className={inputClass}
          placeholder="ornek@email.com"
        />
      </div>
      <div className="flex flex-col gap-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="password">
          Şifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className={inputClass}
          placeholder="••••••••"
        />
      </div>

      {errorMessage && (
        <div className="flex items-center gap-xs text-error font-label-sm">
          <Icon name="error" className="text-[18px]" />
          {errorMessage}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
