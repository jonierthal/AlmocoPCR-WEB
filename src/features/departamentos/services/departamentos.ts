import { api } from '@lib/axios';
import { departamentosEndpoints } from '../api/endpoints';
import { Departamento } from '../types/departamento';

interface CreateDepartamentoPayload {
  nome: string;
}

export async function fetchDepartamentos() {
  const response = await api.get<Departamento[]>(departamentosEndpoints.list);
  return response.data;
}

export async function createDepartamento(payload: CreateDepartamentoPayload) {
  return api.post(departamentosEndpoints.create, payload);
}

export async function deleteDepartamento(id: number) {
  return api.delete(departamentosEndpoints.remove(id));
}

export async function updateDepartamento(id: number, nome: string) {
  return api.put(departamentosEndpoints.update(id), {
    setor: {
      nome,
    },
  });
}