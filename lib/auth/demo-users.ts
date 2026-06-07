/** Sunum / geliştirme modu için sabit panel kullanıcıları (DB gerekmez). */
export const DEMO_USERS = [
  {
    id: "demo-admin",
    email: "admin@riversidetinyhouse.com",
    password: "riverside123",
    name: "Riverside Yönetici",
    role: "ADMIN" as const,
  },
  {
    id: "demo-staff",
    email: "resepsiyon@riversidetinyhouse.com",
    password: "riverside123",
    name: "Ayşe Demir",
    role: "STAFF" as const,
  },
];

export function isDemoAuthEnabled() {
  return process.env.ADMIN_DEMO_MODE === "true";
}

export function authenticateDemoUser(email: string, password: string) {
  const user = DEMO_USERS.find(
    (u) => u.email === email && u.password === password
  );
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
