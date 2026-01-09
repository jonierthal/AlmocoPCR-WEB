import { api } from '../../../lib/axios';
import { Funcionario } from '../types/funcionario';

export interface CreateFuncionarioPayload {
  codFuncionario: number;
  nameFuncionario: string;
  departamentos: number;
}

export interface UpdateFuncionarioPayload {
  funcionario: {
    id: number;
    nome: string;
    setor_id: number;
  };
}

export async function createFuncionario(payload: CreateFuncionarioPayload) {
  return api.post('/cadastro_funcionario', payload);
}

export async function fetchFuncionarios() {
  const response = await api.get<{ pesquisaFuncionario: Funcionario[] }>('/cad_fun_id');
  return response.data.pesquisaFuncionario;
}

export async function deleteFuncionario(id: number) {
  return api.delete(`/cadastro/${id}`);
}

export async function verifyFuncionarioId(id: number) {
  const response = await api.get<{ idExiste: boolean }>(`/verificar-id/${id}`);
  return response.data;
}

export async function updateFuncionario(id: number, payload: UpdateFuncionarioPayload) {
  return api.put(`/edita_cadastro/${id}`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}