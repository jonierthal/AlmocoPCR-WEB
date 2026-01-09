import { ROUTES } from "./routes";

export const NAV_ITEMS = ROUTES.map(({ label, path }) => ({  label,
  path,
})) satisfies ReadonlyArray<{ label: string; path: string }>;