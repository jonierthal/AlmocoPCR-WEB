import { Routes, Route } from "react-router-dom";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { ROUTE_REGISTRY } from "./registry";
import { ROUTES } from "./routes";

export function Router() {
  const rootRoute = ROUTE_REGISTRY.find((route) => route.key === "home");

  return (
    <Routes>
      <Route path={rootRoute?.path ?? "/"} element={<DefaultLayout />}>
        {ROUTES.map((route) => (
          <Route key={route.key} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
}