// Minimal className birleştirici (harici bağımlılık olmadan)
export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[];

export function clsx(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string" || typeof input === "number") {
      out.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = clsx(...input);
      if (inner) out.push(inner);
    }
  }
  return out.join(" ");
}
