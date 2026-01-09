import { api } from '../lib/axios';
import { Departamento } from '../types/departamento';

export async function fetchSetores() {
  const response = await api.get<Departamento[]>('/setores');
  return response.data;
}