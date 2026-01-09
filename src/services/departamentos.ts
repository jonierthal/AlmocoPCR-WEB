import { api } from '../lib/axios';
import { Departamento } from '../types/departamento';

interface CreateDepartamentoPayload {
  nome: string;
}

export async function fetchDepartamentos() {
  const response = await api.get<Departamento[]>('/setores');
  return response.data;
}

export async function createDepartamento(payload: CreateDepartamentoPayload) {
  return api.post('/cadastro_setor', payload);
}

export async function deleteDepartamento(id: number) {
  return api.delete(`/setores/${id}`);
}

export async function updateDepartamento(id: number, nome: string) {
  return api.put(`/edita_setor/${id}`, {
    setor: {
      nome,
    },
  });
}