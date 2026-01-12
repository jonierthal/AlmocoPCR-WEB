import { useCallback, useEffect, useState } from "react";

import { fetchDepartamentos } from "@features/departamentos/services/departamentos";
import { Departamento } from "../types/departamento";

export function useDepartamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const carregarDepartamentos = useCallback(async () => {
    setLoading(true);

    try {
      const dados = await fetchDepartamentos();
      setDepartamentos(dados);
    } catch (err) {
      console.error("Erro ao carregar departamentos:", err);
      setError("Erro ao carregar departamentos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDepartamentos();
  }, [carregarDepartamentos]);

  return {
    departamentos,
    loading,
    error,
    recarregar: carregarDepartamentos,
  };
}