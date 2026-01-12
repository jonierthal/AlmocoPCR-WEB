import { createElement } from "react";
import { CadastroDepartamento, ManutDepartamentos } from "@features/departamentos";
import { Home, ManutFuncionarios } from "@features/funcionarios";
import { Relatorios } from "@features/relatorios";

export const ROUTE_CONFIG = [
  {
    key: "home",
    path: "/",
    element: createElement(Home),  },
  {
    key: "manutFuncionarios",
    path: "/manutencao-funcionarios",
    element: createElement(ManutFuncionarios),  },
  {
    key: "cadastroDepartamento",
    path: "/cadastro-departamento",
    element: createElement(CadastroDepartamento),  },
  {
    key: "manutDepartamentos",
    path: "/manutencao-departamentos",
    element: createElement(ManutDepartamentos),  },
  {
    key: "relatorios",
    path: "/relatorios",
    element: createElement(Relatorios),
    },
] as const satisfies ReadonlyArray<{
  key: string;
  path: string;
  element: JSX.Element;
}>;

export type RouteKey = (typeof ROUTE_CONFIG)[number]["key"];