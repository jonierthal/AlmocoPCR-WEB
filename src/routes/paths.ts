export const ROUTES = {
  home: "/",
  cadastroDepartamento: "/CadastroDepartamento",
  manutFuncionarios: "/ManutFuncionarios",
  manutDepartamentos: "/ManutDepartamentos",
  relatorios: "/Relatorios",
} as const;

export const NAV_ITEMS = [
  {
    label: "Cadastro de funcionários",
    path: ROUTES.home,
  },
  {
    label: "Manutenção de funcionários",
    path: ROUTES.manutFuncionarios,
  },
  {
    label: "Cadastro de Deparatamento",
    path: ROUTES.cadastroDepartamento,
  },
  {
    label: "Manutenção de Departamento",
    path: ROUTES.manutDepartamentos,
  },
  {
    label: "Relatórios",
    path: ROUTES.relatorios,
  },
] as const;