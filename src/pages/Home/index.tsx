import { Button } from "../../components/Button";
import { SubtitleComp } from "../../components/Subtitle";
import { TitleComp } from "../../components/Title";
import { StyledSelect, Fieldset, Input, InputContainer } from "./styles";

import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { useForm } from 'react-hook-form'
import { useEffect, useState } from "react";

import { FormAlert } from "../../components/Feedback/FormAlert"
import { LoadingSpinner } from "../../components/Feedback/LoadingSpinner";
import { FormFieldError } from "../../components/Feedback/FormFieldError";
import { getFieldErrorMessage } from "../../utils/form";
import { fetchSetores } from "../../services/setores";
import { createFuncionario } from "../../services/funcionario";
import { Departamento } from "../../types/departamento";

const novoValidacaoFormularioSchema = Yup.object().shape({
    nome: Yup.string().min(1, 'Informe o nome'),
    codigo: Yup
      .number()
      .typeError('Informe um código válido')
      .positive('Informe um número válido para o código')
      .integer('O código deve ser um número inteiro'),
    departamento: Yup.string().required('Selecione um departamento')
  });
  
interface NewValidationFormData {
    codigo: number;
    nome: string;
    departamento: number;
}

export function Home(){
    const [departamento, setDepartamentos] = useState<Departamento[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<NewValidationFormData>({
        resolver: yupResolver(novoValidacaoFormularioSchema),
        defaultValues: {
            nome:'',
            codigo: undefined,
            departamento: undefined
        }
    });

    useEffect(() => {
      async function fetchDepartamentos() {
        try {
          const setores = await fetchSetores();
          setDepartamentos(setores);
        } catch (error) {
            console.error("Erro ao carregar os departamentos", error);
        }
      }
      fetchDepartamentos();
    }, []);

    async function handleSubmitForm(data: NewValidationFormData) {
        
        try {
          setLoading(true);

          const response = await createFuncionario({
            codFuncionario: data.codigo,
            nameFuncionario: data.nome,
            departamentos: data.departamento
          });
    
          if (response.status === 200) {
            setSuccessMessage('Funcionário cadastrado com sucesso!')
            setTimeout(() => {
                setSuccessMessage('');
              }, 4000);
            reset();
          }
        } catch (error: any) {
          setErrorMessage(error.response?.data?.message || 'Ocorreu um erro ao cadastrar o funcionário');
          setTimeout(() => {
            setErrorMessage('');
          }, 4000)
          reset();
        } finally {
            setLoading(false);
        }
      }
    
      return (
        <>
          <Fieldset>
            <TitleComp title="Cadastro de funcionários" />
    
            <SubtitleComp subtitle="Preencha as informações" />
    
            <form onSubmit={handleSubmit(handleSubmitForm)} action="">
              <InputContainer>
                <Input
                  type="number"
                  placeholder="Código"
                  id="codigo"
                  {...register('codigo', { valueAsNumber: true })}
                />
                <FormFieldError message={getFieldErrorMessage(errors, 'codigo')} />
              </InputContainer>
              <InputContainer>
                <Input
                  type="text"
                  placeholder="Nome"
                  id="nome"
                  {...register('nome')}
                />
                <FormFieldError message={getFieldErrorMessage(errors, 'nome')} />
              </InputContainer>
              <InputContainer>
                <StyledSelect id="departamento" {...register('departamento')} defaultValue="">
                  <option value="" disabled>Selecione um departamento</option>
                  {departamento.map((setor: any) => (
                    <option key={setor.id} value={setor.id}>{setor.nome}</option>
                   ))}
                </StyledSelect>
                <FormFieldError message={getFieldErrorMessage(errors, 'departamento')} />
              </InputContainer>

              {loading && <LoadingSpinner />}
              <Button name="Confirmar" type="submit" />
            </form>
            <FormAlert message={successMessage} variant="success" />
            <FormAlert message={errorMessage} variant="danger" />
          </Fieldset>
        </>
      );
    }
