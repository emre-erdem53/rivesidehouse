import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Yönetim Girişi",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-gutter bg-surface relative overflow-hidden">
      {/* Atmosferik arka plan */}
      <div className="absolute inset-0 wood-texture opacity-100" />
      <div className="absolute inset-0 bg-primary/50 backdrop-blur-sm" />
      <div className="absolute inset-0 fog-animation opacity-20">
        <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-lg">
          <h1 className="font-headline-md text-headline-md text-on-primary">
            {site.name}
          </h1>
          <p className="font-label-md text-label-md text-on-primary/70 uppercase tracking-widest mt-xs">
            Yönetim Paneli
          </p>
        </div>

        <div className="glass-card border border-white/30 rounded-xl p-lg shadow-2xl">
          <h2 className="font-headline-sm text-headline-sm text-primary mb-md">
            Hoş Geldiniz
          </h2>
          <LoginForm />
          <p className="mt-md text-center font-body-md text-body-md text-on-surface-variant/70 text-sm">
            Demo: admin@riversidetinyhouse.com / riverside123
          </p>
        </div>

        <Link
          href="/"
          className="block text-center mt-md font-label-md text-on-primary/80 hover:text-on-primary transition-colors"
        >
          ← Siteye dön
        </Link>
      </div>
    </main>
  );
}
