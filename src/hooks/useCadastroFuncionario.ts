import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { createFuncionario } from "../services/funcionario";

const novoValidacaoFormularioSchema = Yup.object().shape({
  nome: Yup.string().min(1, "Informe o nome"),
  codigo: Yup.number()
    .typeError("Informe um código válido")
    .positive("Informe um número válido para o código")
    .integer("O código deve ser um número inteiro"),
  departamento: Yup.string().required("Selecione um departamento"),
});

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

        const response = await createFuncionario({
          codFuncionario: data.codigo,
          nameFuncionario: data.nome,
          departamentos: data.departamento,
        });

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