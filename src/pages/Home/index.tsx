import { Button } from "../../components/Button";
import { SubtitleComp } from "../../components/Subtitle";
import { TitleComp } from "../../components/Title";
import { ErrorsMessage, Fieldset, Input, InputContainer, TextAlertContainer } from "./styles";

import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { useForm } from 'react-hook-form'
import { useState } from "react";
import { Alert } from 'react-bootstrap';

import { ColorRing } from  'react-loader-spinner'

import axios from 'axios';
import { api } from "../../lib/axios";

const novoValidacaoFormularioSchema = Yup.object().shape({
    nome: Yup.string().min(1, 'Informe o nome'),
    codigo: Yup
      .number()
      .typeError('Informe um código válido')
      .positive('Informe um número válido para o código')
      .integer('O código deve ser um número inteiro')
  });
  
interface NewValidationFormData {
    codigo: number;
    nome: string;
}


export function Home(){
    const [success, setSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, watch,reset, formState: { errors } } = useForm<NewValidationFormData>({
        resolver: yupResolver(novoValidacaoFormularioSchema),
        defaultValues: {
            nome:''
        }
    });

    async function handleSubmitForm(data: NewValidationFormData) {
        
        try {
          setLoading(true);

          const response = await api.post('/cadastro_funcionario', {
            codFuncionario: data.codigo,
            nameFuncionario: data.nome
          });
    
          if (response.status === 200) {
            setSuccess(true);
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
    
      function getErrorMessage(field: string, errors: any) {
        const error = errors[field];
        if (error) {
          return <ErrorsMessage>{error.message}</ErrorsMessage>;
        }
        return null;
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
                {getErrorMessage('codigo', errors)}
              </InputContainer>
              <InputContainer>
                <Input
                  type="text"
                  placeholder="Nome"
                  id="nome"
                  {...register('nome')}
                />
                {getErrorMessage('nome', errors)}
              </InputContainer>

              {loading && 
                    <TextAlertContainer>    
                      <ColorRing
                        visible={true}
                        height="60"
                        width="60"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                      />  
                    </TextAlertContainer>
                }
              <Button name="Confirmar" type="submit" />
            </form>
                {successMessage && 
                    <TextAlertContainer>
                        <Alert variant="success">{successMessage}</Alert>
                    </TextAlertContainer>
                }
                {errorMessage && 
                    <TextAlertContainer>
                        <Alert variant="danger">Erro! {errorMessage}</Alert>
                    </TextAlertContainer>        
                }
          </Fieldset>
        </>
      );
    }
