import { Fieldset, Input, InputContainer } from './styles';
import {
  Button,
  FormAlert,
  FormFieldError,
  LoadingSpinner,
  Subtitle,
  Title,
} from '../../../../components';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form'
import { useState } from 'react';

import { getFieldErrorMessage } from '../../../../utils/form';
import { createDepartamento } from '../../../../services';

interface NewValidationFormData {
    nome: string;
}

const novoValidacaoFormularioSchema = Yup.object().shape({
    nome: Yup.string().min(1, 'Informe o nome'),
  });


export function CadastroDepartamento(){
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<NewValidationFormData>({
        resolver: yupResolver(novoValidacaoFormularioSchema),
        defaultValues: {
            nome:''
        }
    });

    async function handleSubmitForm(data: NewValidationFormData) {

        try {
            setLoading(true);

            const response = await createDepartamento({
                nome: data.nome
            });
            
            if (response.status == 200) {
                setSuccessMessage('Departamento cadastrado com sucesso!')
                    setTimeout(() => {
                        setSuccessMessage('');
                    }, 4000);
                reset();        
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Ocorreu um erro ao cadastrar o departamento');
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
                
                <Title title='Cadastro de Departamento' />  
                <Subtitle subtitle='Preencha as informações' />

                <form onSubmit={handleSubmit(handleSubmitForm)} action="">
                    <InputContainer>
                        <Input
                        type="text"
                        placeholder="Nome"
                        id="Nome" 
                        {...register('nome')} 
                        />
                        <FormFieldError message={getFieldErrorMessage(errors, 'nome')} />
                    </InputContainer>

                    {loading && <LoadingSpinner />}

                    <Button name='Confirmar' type='submit' />
                </form>
                <FormAlert message={successMessage} variant="success" />
                <FormAlert message={errorMessage} variant="danger" />
            </Fieldset>
        </>
    );
}
