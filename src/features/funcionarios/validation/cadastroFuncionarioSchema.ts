import * as Yup from "yup";

export const novoValidacaoFormularioSchema = Yup.object().shape({
  nome: Yup.string().min(1, "Informe o nome"),
  codigo: Yup.number()
    .typeError("Informe um código válido")
    .positive("Informe um número válido para o código")
    .integer("O código deve ser um número inteiro"),
  departamento: Yup.string().required("Selecione um departamento"),
});