import {
  ButonContainer,
  ButtonGreen,
} from '@features/funcionarios/pages/ManutFuncionarios/styles';
import { ButtonRed } from '../pages/Relatorios/styles';
import { ContainerModal } from '@styles/shared/modal';
import { LoadingSpinner, Subtitle } from '@components';
import { TitleComp } from '@components/Title/styles';
import { SpinnerContainer } from '../pages/Relatorios/styles';

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  title: string;
  subtitle: string;
  loading: boolean;
  onConfirm: () => void;
};

export function ConfirmDeleteModal({
  isOpen,
  onRequestClose,
  title,
  subtitle,
  loading,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <ContainerModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title}
    >
      <TitleComp>{title}</TitleComp>
      <Subtitle subtitle={subtitle} />
      <SpinnerContainer>{loading && <LoadingSpinner />}</SpinnerContainer>
      <ButonContainer>
        <ButtonGreen onClick={onConfirm}>Confirmar</ButtonGreen>
      </ButonContainer>
      <ButonContainer>
        <ButtonRed onClick={onRequestClose}>Voltar</ButtonRed>
      </ButonContainer>
    </ContainerModal>
  );
}