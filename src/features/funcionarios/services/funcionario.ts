import { api } from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../services/endpoints';
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
  return api.post(API_ENDPOINTS.funcionarios.create, payload);
}

export async function fetchFuncionarios() {
  const response = await api.get<{ pesquisaFuncionario: Funcionario[] }>(
    API_ENDPOINTS.funcionarios.list,
  );
  return response.data.pesquisaFuncionario;
}

export async function deleteFuncionario(id: number) {
  return api.delete(API_ENDPOINTS.funcionarios.remove(id));
}

export async function verifyFuncionarioId(id: number) {
  const response = await api.get<{ idExiste: boolean }>(
    API_ENDPOINTS.funcionarios.verifyId(id),
  );
  return response.data;
}

export async function updateFuncionario(id: number, payload: UpdateFuncionarioPayload) {
  return api.put(API_ENDPOINTS.funcionarios.update(id), payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}