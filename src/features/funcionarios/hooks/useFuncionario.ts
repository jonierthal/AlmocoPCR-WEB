import { useCallback, useEffect, useState } from "react";

import {
  deleteFuncionario,
  fetchFuncionarios,
  updateFuncionario,
  verifyFuncionarioId,
} from "@features/funcionarios/services/funcionario";
import { Funcionario } from "../types/funcionario";

export function useFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessageInputModal, setErrorMessageInputModal] = useState("");

  const carregarFuncionarios = useCallback(async () => {
    setLoading(true);

    try {
      const dados = await fetchFuncionarios();
      setFuncionarios(dados);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Ocorreu um erro ao listar os funcionários. Contate o Administrador!",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarFuncionarios();
  }, [carregarFuncionarios]);

  const handleDelete = useCallback(
    async (id: number, onClose: () => void) => {
      setLoading(true);

      try {
        await deleteFuncionario(id);
        await carregarFuncionarios();
        setSuccessMessage("Funcionário excluído com sucesso!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          "Ocorreu um erro ao excluir o funcionário. Contate o Administrador!",
        );
        setTimeout(() => {
          setErrorMessage("");
        }, 4000);
      } finally {
        setLoading(false);
      }

      onClose();
    },
    [carregarFuncionarios],
  );

  const handleEditarCadastro = useCallback(
    async (
      id: number,
      editId: number,
      editNome: string,
      editDepartamentoId: number,
      onClose: () => void,
    ) => {
      switch (true) {
        case editId > 0:
          await verifyFuncionarioId(editId)
            .then(async (response) => {
              if ((response.idExiste && id === editId) || !response.idExiste) {
                setLoading(true);

                await updateFuncionario(id, {
                  codigo: editId,
                  nome: editNome,
                  departamento: editDepartamentoId,
                })
                  .then(() => {
                    setSuccessMessage("Funcionário editado com sucesso!");
                    setTimeout(() => {
                      setSuccessMessage("");
                    }, 4000);
                  })
                  .catch(() => {
                    setErrorMessage(
                      "Não foi possível editar o funcionário, contate o adminsitrador!",
                    );
                    setTimeout(() => {
                      setErrorMessage("");
                    }, 4000);
                  })
                  .finally(() => {
                    setLoading(false);
                    onClose();
                    carregarFuncionarios();
                  });
              } else if (response.idExiste && id !== editId) {
                onClose();
                setErrorMessage(
                  "Não foi possível alterar este funcionário, pois este código já existe! Digite um código válido!",
                );
                setTimeout(() => {
                  setErrorMessage("");
                }, 6000);
              }
            })
            .catch((error) => {
              console.error("Verificar Id Error: ", error);
            });
          break;
        case editId === 0:
          setErrorMessageInputModal(
            "Id inválido! Este valor não pode ser 0!",
          );
          setTimeout(() => {
            setErrorMessageInputModal("");
          }, 4000);
          break;
        case editId <= 0:
          setErrorMessageInputModal(
            "Id inválido! Este valor não pode ser negativo!",
          );
          setTimeout(() => {
            setErrorMessageInputModal("");
          }, 4000);
          break;
      }
    },
    [carregarFuncionarios],
  );

  return {
    funcionarios,
    loading,
    errorMessage,
    successMessage,
    errorMessageInputModal,
    handleDelete,
    handleEditarCadastro,
  };
}