export const API_ENDPOINTS = {
  funcionarios: {
    create: '/cadastro_funcionario',
    list: '/cad_fun_id',
    remove: (id: number) => `/cadastro/${id}`,
    verifyId: (id: number) => `/verificar-id/${id}`,
    update: (id: number) => `/edita_cadastro/${id}`,
  },
  departamentos: {
    list: '/setores',
    create: '/cadastro_setor',
    remove: (id: number) => `/setores/${id}`,
    update: (id: number) => `/edita_setor/${id}`,
  },
} as const;