export const departamentosEndpoints = {
  list: '/setores',
  create: '/cadastro_setor',
  remove: (id: number) => `/setores/${id}`,
  update: (id: number) => `/edita_setor/${id}`,
} as const;