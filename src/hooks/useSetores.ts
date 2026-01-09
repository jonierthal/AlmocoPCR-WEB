import { useCallback, useEffect, useState } from "react";

import { fetchSetores } from "../services/setores";
import { Departamento } from "../types/departamento";

export function useSetores() {
  const [setores, setSetores] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const carregarSetores = useCallback(async () => {
    setLoading(true);

    try {
      const dados = await fetchSetores();
      setSetores(dados);
    } catch (err) {
      console.error("Erro ao carregar setores:", err);
      setError("Erro ao carregar setores");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarSetores();
  }, [carregarSetores]);

  return {
    setores,
    loading,
    error,
    recarregar: carregarSetores,
  };
}