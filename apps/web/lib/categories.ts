export type Season = "صيفي" | "شتوي" | "خريفي";
export type Promo = "عادي" | "عرض" | "خصم";

export function computeMainCategory(code: number): string {
  const s = String(Math.trunc(code));
  return code < 1000 ? s.slice(0, 1) : s.slice(0, 2);
}
