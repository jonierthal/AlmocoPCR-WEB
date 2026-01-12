import { LoadingSpinner, SubtitleComp } from '../../../../components';
import { Title } from '../../../../components/Title/styles';
import { SpinnerContainer } from '../../../relatorios/pages/Relatorios/styles';
import {
  ButtonGreen,
  ButtonRed,
  ButonContainer,
  ContainerModal,
} from './styles';

type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  deleteNome: string;
  deleteId: number | null;
  loading: boolean;
  onConfirm: () => void;
};

export function DeleteModal({
  isOpen,
  onClose,
  deleteNome,
  deleteId,
  loading,
  onConfirm,
}: DeleteModalProps) {
  return (
    <ContainerModal isOpen={isOpen} onRequestClose={onClose} contentLabel="Confirmar exclusão">
      <Title>Confirmar exclusão?</Title>
      <SubtitleComp
        subtitle={`Você está prestes a excluir o funcionário: \n\n Nome: ${deleteNome} \n Código: ${deleteId}\n\n Tem certeza disso?`}
      />
      <SpinnerContainer>
        {loading && <LoadingSpinner />}
      </SpinnerContainer>
      <ButonContainer>
        <ButtonGreen onClick={onConfirm}>Confirmar</ButtonGreen>
      </ButonContainer>
      <ButonContainer>
        <ButtonRed onClick={onClose}>Voltar</ButtonRed>
      </ButonContainer>
    </ContainerModal>
  );
}