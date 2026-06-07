import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // /yonetim altındaki tüm rotaları koru
  matcher: ["/yonetim/:path*"],
};
