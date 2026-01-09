import { CadastroDepartamento } from "../pages/CadastroDepartamento";
import { Home } from "../pages/Home";
import { ManutDepartamentos } from "../pages/ManutDepartamentos";
import { ManutFuncionarios } from "../pages/ManutFuncionarios";
import { Relatorios } from "../pages/Relatorios";
import { ROUTE_REGISTRY, type RouteKey } from "./registry";

const ROUTE_ELEMENTS = {
  home: <Home />,
  manutFuncionarios: <ManutFuncionarios />,
  cadastroDepartamento: <CadastroDepartamento />,
  manutDepartamentos: <ManutDepartamentos />,
  relatorios: <Relatorios />,
} satisfies Record<RouteKey, JSX.Element>;

export const ROUTES = ROUTE_REGISTRY.map((route) => ({
  ...route,
  element: ROUTE_ELEMENTS[route.key],
}));