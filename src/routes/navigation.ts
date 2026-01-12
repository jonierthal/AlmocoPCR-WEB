import { ROUTE_CONFIG, type RouteKey } from "./config";

const NAV_LABELS: Record<RouteKey, string> = {
  home: "Cadastro de funcionários",
  manutFuncionarios: "Manutenção de funcionários",
  cadastroDepartamento: "Cadastro de Departamento",
  manutDepartamentos: "Manutenção de Departamento",
  relatorios: "Relatórios",
};

export const NAV_ITEMS = ROUTE_CONFIG.map(({ key, path }) => ({
  label: NAV_LABELS[key],
  path,
})) satisfies ReadonlyArray<{ label: string; path: string }>;