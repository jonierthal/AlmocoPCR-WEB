export type AlmocoType = {
  cod_funcionario: number;
  "Funcionario.nome": string;
  "Funcionario.Setor.nome": string;
  id: number;
  num_almocos: number;
};

export type AlmocoExtraType = {
  id: number;
  nome_aext: string;
  quantidade_aext: number;
};

export type ReservaXisType = {
  cod_funcionario: number;
  quantidade_rx: number;
  "Funcionario.nome": string;
  "Funcionario.Setor.nome": string;
  id: number;
};

export type AlmocosPeriodoType = {
  id_fun: number;
  nome: string;
  quantidade: number;
  setor_nome: string;
};

export type ReservaXisPeriodoType = {
  id_fun: number;
  nome: string;
  quantidade_rx: number;
  setor_nome: string;
};

export type EmailDestinatarioTipo = 'ALMOCO' | 'XIS';

export type EmailDestinatario = {
  id: number;
  email: string;
  nome: string;
  tipo: EmailDestinatarioTipo;
  ativo: boolean;
};

export type EmailDestinatarioPayload = {
  email: string;
  nome: string;
  tipo: EmailDestinatarioTipo;
  ativo: boolean;
};

export type RelatorioEmailPayload = {
 tipoRelatorio: EmailDestinatarioTipo;
  dataReferencia: string;
  destinatariosExtras?: string[];
};