import { api } from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../services/endpoints';
import { Departamento } from '../types/departamento';

interface CreateDepartamentoPayload {
  nome: string;
}

export async function fetchDepartamentos() {
  const response = await api.get<Departamento[]>(API_ENDPOINTS.departamentos.list);
  return response.data;
}

export async function createDepartamento(payload: CreateDepartamentoPayload) {
  return api.post(API_ENDPOINTS.departamentos.create, payload);
}

export async function deleteDepartamento(id: number) {
  return api.delete(API_ENDPOINTS.departamentos.remove(id));
}

export async function updateDepartamento(id: number, nome: string) {
  return api.put(API_ENDPOINTS.departamentos.update(id), {
    setor: {
      nome,
    },
  });
}