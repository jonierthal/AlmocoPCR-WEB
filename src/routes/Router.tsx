import { Routes, Route } from "react-router-dom";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { ROUTES } from "./routes";

export function Router() {

  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        {ROUTES.map((route) => (
          <Route key={route.key} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
}