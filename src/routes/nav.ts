import { ROUTES } from "./paths";

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
    label: "Cadastro de Departamento",
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