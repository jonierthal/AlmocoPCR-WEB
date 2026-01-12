import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { createFuncionario } from "@services";
import { novoValidacaoFormularioSchema } from "../validation/cadastroFuncionarioSchema";

export interface NewValidationFormData {
  codigo: number;
  nome: string;
  departamento: number;
}

export function useCadastroFuncionario() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewValidationFormData>({
    resolver: yupResolver(novoValidacaoFormularioSchema),
    defaultValues: {
      nome: "",
      codigo: undefined,
      departamento: undefined,
    },
  });

  const submitCadastro = useCallback(
    async (data: NewValidationFormData) => {
      try {
        setLoading(true);

        const response = await createFuncionario(data);

        if (response.status === 200) {
          setSuccessMessage("Funcionário cadastrado com sucesso!");
          setTimeout(() => {
            setSuccessMessage("");
          }, 4000);
          reset();
        }
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.message ||
            "Ocorreu um erro ao cadastrar o funcionário",
        );
        setTimeout(() => {
          setErrorMessage("");
        }, 4000);
        reset();
      } finally {
        setLoading(false);
      }
    },
    [reset],
  );

  return {
    register,
    handleSubmit,
    errors,
    loading,
    errorMessage,
    successMessage,
    submitCadastro,
  };
}