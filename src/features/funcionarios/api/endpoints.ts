export const funcionariosEndpoints = {
  create: '/cadastro_funcionario',
  list: '/cad_fun_id',
  remove: (id: number) => `/cadastro/${id}`,
  verifyId: (id: number) => `/verificar-id/${id}`,
  update: (id: number) => `/edita_cadastro/${id}`,
} as const;