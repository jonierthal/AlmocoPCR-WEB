import { CadastroDepartamento } from "../pages/CadastroDepartamento";
import { Home } from "../pages/Home";
import { ManutDepartamentos } from "../pages/ManutDepartamentos";
import { ManutFuncionarios } from "../pages/ManutFuncionarios";
import { Relatorios } from "../pages/Relatorios";
export const ROUTES = [
  {
    key: "home",
    label: "Cadastro de funcionários",
    path: "/",
    element: <Home />,
  },
  {
    key: "manutFuncionarios",
    label: "Manutenção de funcionários",
    path: "/manutencao-funcionarios",
    element: <ManutFuncionarios />,
  },
  {
    key: "cadastroDepartamento",
    label: "Cadastro de Departamento",
    path: "/cadastro-departamento",
    element: <CadastroDepartamento />,
  },
  {
    key: "manutDepartamentos",
    label: "Manutenção de Departamento",
    path: "/manutencao-departamentos",
    element: <ManutDepartamentos />,
  },
  {
    key: "relatorios",
    label: "Relatórios",
    path: "/relatorios",
    element: <Relatorios />,
  },
] as const satisfies ReadonlyArray<{
  key: string;
  label: string;
  path: string;
  element: JSX.Element;
}>;

export type RouteKey = (typeof ROUTES)[number]["key"];