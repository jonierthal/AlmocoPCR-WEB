import { ROUTE_CONFIG, type RouteKey } from "./config";

export const ROUTE_PATHS = ROUTE_CONFIG.reduce((acc, route) => {
  acc[route.key] = route.path;
  return acc;
}, {} as Record<RouteKey, string>);