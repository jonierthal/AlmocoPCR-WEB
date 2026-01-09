import { Fieldset, Input, InputContainer } from './styles';
import { TitleComp } from '../../components/Title';
import { SubtitleComp } from '../../components/Subtitle';
import { Button } from '../../components/Button';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form'
import { useState } from 'react';

import { api } from '../../lib/axios';
import { FormAlert } from '../../components/Feedback/FormAlert';
import { LoadingSpinner } from '../../components/Feedback/LoadingSpinner';
import { FormFieldError } from '../../components/Feedback/FormFieldError';
import { getFieldErrorMessage } from '../../utils/form';

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

            const response = await api.post('/cadastro_setor', {
                nome: data.nome
            });
            
            if (response.status == 200) {
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
