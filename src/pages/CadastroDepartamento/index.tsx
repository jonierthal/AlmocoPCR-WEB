import { Fieldset, Input, InputContainer, ErrorsMessage, TextAlertContainer } from './styles';
import { TitleComp } from '../../components/Title';
import { SubtitleComp } from '../../components/Subtitle';
import { Button } from '../../components/Button';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { Alert } from'react-bootstrap';	
import { ColorRing } from  'react-loader-spinner'

import { useForm } from 'react-hook-form'
import { useState } from 'react';

import axios from 'axios';
import { api } from '../../lib/axios';

interface NewValidationFormData {
    nome: string;
}

const novoValidacaoFormularioSchema = Yup.object().shape({
    nome: Yup.string().min(1, 'Informe o nome'),
  });


export function CadastroDepartamento(){
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

            const response = await api.post('/cadastro_setor', {
                nome: data.nome
            });
            
            if (response.status == 200) {
                setSuccess(true);
                setSuccessMessage('Setor cadastrado com sucesso!')
                    setTimeout(() => {
                        setSuccessMessage('');
                    }, 4000);
                reset();        
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Ocorreu um erro ao cadastrar o setor');
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
                
                <TitleComp title='Cadastro de Departamento' />  
                <SubtitleComp subtitle='Preencha as informações' />

                <form onSubmit={handleSubmit(handleSubmitForm)} action="">
                    <InputContainer>
                        <Input
                        type="text"
                        placeholder="Nome"
                        id="Nome" 
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

                    <Button name='Confirmar' type='submit' />
                </form>
                {successMessage && 
                    <TextAlertContainer>
                        <Alert variant='success'>{successMessage}</Alert>
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
