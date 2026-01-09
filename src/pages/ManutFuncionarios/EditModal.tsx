import { SubtitleComp } from '../../components/Subtitle';
import { TitleComp } from '../../components/Title';
import { Departamento } from '../../types/departamento';
import {
  ButtonGreen,
  ButtonRed,
  ButonContainer,
  ContainerModal,
  Input,
  InputContainer,
  StyledAlert,
  StyledSelect,
  TextAlertContainer,
} from './styles';

type EditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  departamentos: Departamento[];
  editId: number;
  editNome: string;
  editDepartamentoId: number;
  chaveEditId: number;
  errorMessageInputModal: string;
  onChangeEditId: (value: number) => void;
  onChangeEditNome: (value: string) => void;
  onChangeEditDepartamentoId: (value: number) => void;
};

export function EditModal({
  isOpen,
  onClose,
  onSubmit,
  departamentos,
  editId,
  editNome,
  editDepartamentoId,
  chaveEditId,
  errorMessageInputModal,
  onChangeEditId,
  onChangeEditNome,
  onChangeEditDepartamentoId,
}: EditModalProps) {
  return (
    <ContainerModal isOpen={isOpen} onRequestClose={onClose}>
      <TitleComp title="Editar funcionário" />
      <SubtitleComp subtitle="Preencha as informações" />
      <form onSubmit={onSubmit}>
        <InputContainer>
          <Input
            type="number"
            id="codigo"
            defaultValue={chaveEditId}
            onChange={(e) => onChangeEditId(parseInt(e.target.value))}
            required
            onInvalid={(e: React.FormEvent<HTMLInputElement>) => {
              e.currentTarget.setCustomValidity('Por favor, preencha este campo.');
              e.currentTarget.setAttribute('aria-invalid', 'true');
            }}
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              e.currentTarget.setCustomValidity('');
              e.currentTarget.setAttribute('aria-invalid', 'false');
            }}
          />
          {errorMessageInputModal && (
            <TextAlertContainer>
              <StyledAlert variant="danger">{errorMessageInputModal}</StyledAlert>
            </TextAlertContainer>
          )}
        </InputContainer>
        <InputContainer>
          <Input
            type="text"
            id="nome"
            value={editNome}
            onChange={(e) => onChangeEditNome(e.target.value)}
            required
            onInvalid={(e: React.FormEvent<HTMLInputElement>) => {
              e.currentTarget.setCustomValidity('Por favor, preencha este campo.');
              e.currentTarget.setAttribute('aria-invalid', 'true');
            }}
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              e.currentTarget.setCustomValidity('');
              e.currentTarget.setAttribute('aria-invalid', 'false');
            }}
          />
        </InputContainer>
        <InputContainer>
          <StyledSelect
            id="departamento"
            value={editDepartamentoId || ''}
            onChange={(e) => onChangeEditDepartamentoId(parseInt(e.target.value))}
            required
          >
            <option value="" disabled={!editDepartamentoId}>
              Selecione um departamento
            </option>
            {departamentos.map((departamento) => (
              <option key={departamento.id} value={departamento.id}>
                {departamento.nome}
              </option>
            ))}
          </StyledSelect>
        </InputContainer>

        <ButonContainer>
          <ButtonGreen type="submit">Confirmar</ButtonGreen>
        </ButonContainer>
        <ButonContainer>
          <ButtonRed onClick={onClose}>Voltar</ButtonRed>
        </ButonContainer>
      </form>
    </ContainerModal>
  );
}