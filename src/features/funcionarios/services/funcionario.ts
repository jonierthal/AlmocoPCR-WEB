import { api } from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../services/endpoints';
import { Funcionario } from '../types/funcionario';

export interface CreateFuncionarioPayload {
  codigo: number;
  nome: string;
  departamento: number;
}

export interface UpdateFuncionarioPayload {
  codigo: number;
  nome: string;
  departamento: number;
}

export async function createFuncionario(payload: CreateFuncionarioPayload) {
  return api.post(API_ENDPOINTS.funcionarios.create, {
    codFuncionario: payload.codigo,
    nameFuncionario: payload.nome,
    departamentos: payload.departamento,
  });
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

export async function updateFuncionario(
  id: number,
  payload: UpdateFuncionarioPayload,
) {
  return api.put(API_ENDPOINTS.funcionarios.update(id), {
    funcionario: {
      id: payload.codigo,
      nome: payload.nome,
      setor_id: payload.departamento,
    },
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}