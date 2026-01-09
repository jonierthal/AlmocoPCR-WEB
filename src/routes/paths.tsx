import { ROUTE_REGISTRY } from "./registry";
export { ROUTE_REGISTRY } from "./registry";

export const ROUTES = ROUTE_REGISTRY.reduce((acc, route) => {
  acc[route.key] = route.path;
  return acc;
}, {} as Record<(typeof ROUTE_REGISTRY)[number]["key"], string>);