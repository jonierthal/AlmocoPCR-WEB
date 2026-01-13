import { api } from '@lib/axios';
import { Funcionario } from '@features/funcionarios/types';
import { funcionariosEndpoints } from '../api/endpoints';

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
  return api.post(funcionariosEndpoints.create, {
    codFuncionario: payload.codigo,
    nameFuncionario: payload.nome,
    departamentos: payload.departamento,
  });
}

export async function fetchFuncionarios() {
  const response = await api.get<{ pesquisaFuncionario: Funcionario[] }>(
    funcionariosEndpoints.list,
  );
  return response.data.pesquisaFuncionario;
}

export async function deleteFuncionario(id: number) {
  return api.delete(funcionariosEndpoints.remove(id));
}

export async function verifyFuncionarioId(id: number) {
  const response = await api.get<{ idExiste: boolean }>(
    funcionariosEndpoints.verifyId(id),
  );
  return response.data;
}

export async function updateFuncionario(
  id: number,
  payload: UpdateFuncionarioPayload,
) {
  return api.put(funcionariosEndpoints.update(id), {
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