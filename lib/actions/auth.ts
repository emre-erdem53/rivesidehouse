"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/yonetim/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "E-posta veya şifre hatalı.";
        default:
          return "Giriş yapılırken bir hata oluştu.";
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/giris" });
}
