export interface Funcionario {
  id_fun: number;
  nome: string;
  setor_id: number;
  Setor: {
    nome: string;
  };
}