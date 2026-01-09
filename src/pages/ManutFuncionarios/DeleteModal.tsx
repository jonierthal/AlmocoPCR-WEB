import { ColorRing } from 'react-loader-spinner';
import { SubtitleComp } from '../../components/Subtitle';
import { Title } from '../../components/Title/styles';
import { SpinnerContainer } from '../Relatorios/styles';
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
        {loading && (
          <ColorRing
            visible={true}
            height="60"
            width="60"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          />
        )}
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