import { Routes, Route } from "react-router-dom";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { Home } from "../pages/Home";
import { ManutFuncionarios } from "../pages/ManutFuncionarios";
import { Relatorios } from "../pages/Relatorios";
import { CadastroDepartamento } from "../pages/CadastroDepartamento";
import { ManutDepartamentos } from "../pages/ManutDepartamentos";
import { ROUTES } from "./paths";


export function Router() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<DefaultLayout />}>
        <Route path={ROUTES.home} element={<Home />} />
        <Route
          path={ROUTES.cadastroDepartamento}
          element={<CadastroDepartamento />}
        />
        <Route path={ROUTES.manutFuncionarios} element={<ManutFuncionarios />} />
        <Route
          path={ROUTES.manutDepartamentos}
          element={<ManutDepartamentos />}
        />
        <Route path={ROUTES.relatorios} element={<Relatorios />} />
      </Route>
    </Routes>
  );
}