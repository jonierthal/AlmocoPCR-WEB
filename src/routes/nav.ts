import { ROUTE_REGISTRY } from "./paths";

export const NAV_ITEMS = ROUTE_REGISTRY.map(({ label, path }) => ({
  label,
  path,
})) as const;