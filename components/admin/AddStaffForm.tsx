"use client";

import { useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { addStaff, type StaffActionState } from "@/lib/actions/staff";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 bg-primary text-on-primary px-md py-sm rounded-lg font-label-md hover:opacity-90 disabled:opacity-50 h-fit"
    >
      <Icon name="person_add" className="text-[18px]" />
      {pending ? "Ekleniyor..." : "Personel Ekle"}
    </button>
  );
}

export function AddStaffForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(
    async (prev: StaffActionState, fd: FormData) => {
      const res = await addStaff(prev, fd);
      if (res.ok) formRef.current?.reset();
      return res;
    },
    {} as StaffActionState
  );

  const inputClass =
    "bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-sm py-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md w-full";

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-md grid grid-cols-1 md:grid-cols-3 gap-md items-end mb-lg"
    >
      <label className="flex flex-col gap-xs">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          Ad Soyad
        </span>
        <input name="fullName" required className={inputClass} placeholder="Ayşe Demir" />
      </label>
      <label className="flex flex-col gap-xs">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          Görev
        </span>
        <input name="role" required className={inputClass} placeholder="Resepsiyon Şefi" />
      </label>
      <label className="flex flex-col gap-xs">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          Departman
        </span>
        <input name="department" className={inputClass} placeholder="Ön Büro" />
      </label>
      <label className="flex flex-col gap-xs">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          Vardiya
        </span>
        <input name="shift" className={inputClass} placeholder="Sabah" />
      </label>
      <label className="flex flex-col gap-xs">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          E-posta
        </span>
        <input name="email" type="email" className={inputClass} placeholder="ornek@email.com" />
      </label>
      <SubmitButton />

      {state.error && (
        <p className="md:col-span-3 font-label-sm text-label-sm text-error">
          {state.error}
        </p>
      )}
    </form>
  );
}
