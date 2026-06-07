"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";
import { clsx } from "@/lib/clsx";
import { logout } from "@/lib/actions/auth";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low shadow-md shadow-on-surface-variant/5 flex flex-col p-md gap-sm z-50">
      <div className="mb-lg px-xs">
        <h1 className="font-headline-sm text-headline-sm text-primary">
          Riverside
        </h1>
        <p className="font-label-md text-label-md text-on-surface-variant opacity-70">
          Yönetim Paneli
        </p>
      </div>

      <nav className="flex-1 flex flex-col gap-xs overflow-y-auto">
        {adminNav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-sm px-sm py-sm rounded-lg transition-all duration-200 active:translate-x-1",
                active
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              <Icon name={item.icon} fill={active} />
              <span className="font-label-md text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-outline-variant/20 pt-md flex flex-col gap-xs">
        <Link
          href="/rezervasyon"
          className="bg-primary text-on-primary rounded-xl py-sm px-md font-label-md text-label-md text-center mb-sm hover:opacity-90 transition-opacity"
        >
          Yeni Rezervasyon
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="w-full text-on-surface-variant hover:bg-surface-container-high transition-colors flex items-center gap-sm px-sm py-sm rounded-lg"
          >
            <Icon name="logout" />
            <span className="font-label-md text-label-md">Çıkış Yap</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
