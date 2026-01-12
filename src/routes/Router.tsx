import { Routes, Route } from "react-router-dom";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { ROUTE_CONFIG } from "./config";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        {ROUTE_CONFIG.map((route) => (
          <Route key={route.key} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
}