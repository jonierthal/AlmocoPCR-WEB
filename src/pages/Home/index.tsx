import { Button } from "../../components/Button";
import { SubtitleComp } from "../../components/Subtitle";
import { TitleComp } from "../../components/Title";
import { StyledSelect, Fieldset, Input, InputContainer } from "./styles";

import { useDepartamentos } from "../../hooks/useDepartamento";
import { useCadastroFuncionario } from "../../hooks/useCadastroFuncionario";

import { FormAlert } from "../../components/Feedback/FormAlert"
import { LoadingSpinner } from "../../components/Feedback/LoadingSpinner";
import { FormFieldError } from "../../components/Feedback/FormFieldError";
import { getFieldErrorMessage } from "../../utils/form";

export function Home(){
    const { departamentos } = useDepartamentos();
    const {
      register,
      handleSubmit,
      errors,
      loading,
      errorMessage,
      successMessage,
      submitCadastro,
    } = useCadastroFuncionario();
    
      return (
        <>
          <Fieldset>
            <TitleComp title="Cadastro de funcionários" />
    
            <SubtitleComp subtitle="Preencha as informações" />
    
            <form onSubmit={handleSubmit(submitCadastro)} action="">
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
                  {departamentos.map((departamento) => (
                    <option key={departamento.id} value={departamento.id}>{departamento.nome}</option>
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
