import { Routes, Route } from "react-router-dom";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { ROUTE_REGISTRY } from "./paths";

export function Router() {
  const rootRoute = ROUTE_REGISTRY.find((route) => route.key === "home");

  return (
    <Routes>
      <Route path={rootRoute?.path ?? "/"} element={<DefaultLayout />}>
        {ROUTE_REGISTRY.map((route) => (
          <Route key={route.key} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
}