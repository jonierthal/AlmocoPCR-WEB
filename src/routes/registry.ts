export const ROUTE_REGISTRY = [
  {
    key: "home",
    label: "Cadastro de funcionários",
    path: "/",
  },
  {
    key: "manutFuncionarios",
    label: "Manutenção de funcionários",
    path: "/manutencao-funcionarios",
  },
  {
    key: "cadastroDepartamento",
    label: "Cadastro de Departamento",
    path: "/cadastro-departamento",
  },
  {
    key: "manutDepartamentos",
    label: "Manutenção de Departamento",
    path: "/manutencao-departamentos",
  },
  {
    key: "relatorios",
    label: "Relatórios",
    path: "/relatorios",
  },
] as const;

export type RouteKey = (typeof ROUTE_REGISTRY)[number]["key"];