import { ROUTES, type RouteKey } from "./routes";

export const ROUTE_PATHS = ROUTES.reduce((acc, route) => {
  acc[route.key] = route.path;
  return acc;
}, {} as Record<RouteKey, string>);