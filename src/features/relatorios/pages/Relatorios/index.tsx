import {
  Container,
  ContainerTextFooter,
  RelatoriosContainer,
  SpinnerContainer,
  TextDate,
} from './styles';
import { TextAlertContainer } from "@features/funcionarios/pages/ManutFuncionarios/styles";
import { StyledAlert } from "@styles/shared/modal";
import { useCallback, useState } from "react";
import { LoadingSpinner } from '@components';
import moment from 'moment';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import {
  ConfirmDeleteModal,
  DateFilters,
  EmailSettings,
  RelatorioTable,
  ReportActions,
} from '@features/relatorios/components';
import {
  useEmailDestinatarios,
  useRelatoriosData,
  useRelatoriosEmail,
} from '@features/relatorios/hooks';

// Registra o locale para Português (Brasil)
registerLocale('pt-BR', ptBR);
// Define o locale padrão como Português (Brasil)
setDefaultLocale('pt-BR');

  export function Relatorios(){
    const [isModalOpenAlmoco, setIsModalOpenAlmoco] = useState<boolean>(false);
    const [isModalOpenXis, setIsModalOpenXis] = useState<boolean>(false);
    const [isModalOpenAlm_ext, setIsModalOpenAlm_ext] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleteNome, setDeleteNome] = useState<string>('');

    const showSuccessMessage = useCallback((message: string) => {
      setSuccessMessage(message);
      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
     }, []);

      const showErrorMessage = useCallback((message: string) => {
      setErrorMessage(message);
      setTimeout(() => {
        setErrorMessage('');
      }, 4000);
    }, []);

    const {
      emailMenuOpen,
      enviandoEmail,
      statusEnvios,
      loadingStatus,
      toggleEmailMenu,
      enviarRelatorioPorEmail,
    } = useRelatoriosEmail({
      onSuccessMessage: showSuccessMessage,
      onErrorMessage: showErrorMessage,
    });

    const {
      destinatarios,
      loading: loadingDestinatarios,
      saving: savingDestinatario,
      deleting: deletingDestinatario,
      empty: emptyDestinatarios,
      criar,
      editar,
      toggleAtivo,
      excluir,
    } = useEmailDestinatarios({
      onSuccessMessage: showSuccessMessage,
      onErrorMessage: showErrorMessage,
    });

    const {
      loading,
      loadingAlmoco,
      loadingXis,
      loadingAlm_ext,
      almocos,
      num_almocos,
      almocos_ext,
      numAlmocos_ext,
      reserva_xis,
      startDate,
      endDate,
      setStartDate,
      setEndDate,
      handleRelatorioPeriodo,
      handleGerarRelatorioXis,
      handleGerarRelatorioAlmoco,
      handleDeleteAlmoco,
      handleDeleteXis,
      handleDeleteAlm_ext,
    } = useRelatoriosData({
      onSuccessMessage: showSuccessMessage,
      onErrorMessage: showErrorMessage,
    });

    const date = moment().format('DD/MM/YYYY');

    const openModalAlmoco = useCallback((id: number, nome: string) => {
      setDeleteId(id);
      setDeleteNome(nome);
      setIsModalOpenAlmoco(true);
    }, []);

    const openModalXis = useCallback((id: number, nome: string) => {
      setDeleteId(id);
      setDeleteNome(nome);
      setIsModalOpenXis(true);
    }, []);

    const openModalAlm_ext = useCallback((id: number, nome: string) => {
      setDeleteId(id);
      setDeleteNome(nome);
      setIsModalOpenAlm_ext(true);
    }, []);

    const closeModal = useCallback(() => {
      setDeleteId(null);
      setDeleteNome('');
      setIsModalOpenAlmoco(false);
      setIsModalOpenXis(false);
      setIsModalOpenAlm_ext(false);
    }, []);

        const handleConfirmDeleteAlmoco = useCallback(async () => {
      if (!deleteId) {
        return;
      }

    await handleDeleteAlmoco(deleteId);
      closeModal();
    }, [closeModal, deleteId, handleDeleteAlmoco]);

    const handleConfirmDeleteXis = useCallback(async () => {
      if (!deleteId) {
        return;
      }

      await handleDeleteXis(deleteId);
      closeModal();
    }, [closeModal, deleteId, handleDeleteXis]);

    const handleConfirmDeleteAlm_ext = useCallback(async () => {
      if (!deleteId) {
        return;
      }

      await handleDeleteAlm_ext(deleteId);
      closeModal();
    }, [closeModal, deleteId, handleDeleteAlm_ext]);

    return(
        <Container>
          {errorMessage &&
            <TextAlertContainer>   
              <StyledAlert variant="danger">{errorMessage}</StyledAlert>
            </TextAlertContainer>   
          }
          {successMessage && 
            <TextAlertContainer>   
              <StyledAlert variant="success ">{successMessage}</StyledAlert>
            </TextAlertContainer>   
          }
            <RelatoriosContainer>
                <ReportActions
                onGerarRelatorioAlmoco={handleGerarRelatorioAlmoco}
                onGerarRelatorioXis={handleGerarRelatorioXis}
              />
              <DateFilters
                startDate={startDate}
                endDate={endDate}
                onChangeStartDate={setStartDate}
                onChangeEndDate={setEndDate}
                onGenerateReport={handleRelatorioPeriodo}
              />
            </RelatoriosContainer>
            <EmailSettings
              emailMenuOpen={emailMenuOpen}
              onToggleMenu={toggleEmailMenu}
              destinatarios={destinatarios}
              loadingDestinatarios={loadingDestinatarios}
              savingDestinatario={savingDestinatario}
              deletingDestinatario={deletingDestinatario}
              emptyDestinatarios={emptyDestinatarios}
              onCriarDestinatario={criar}
              onEditarDestinatario={editar}
              onToggleAtivo={toggleAtivo}
              onExcluirDestinatario={excluir}
              enviandoEmail={enviandoEmail}
              statusEnvios={statusEnvios}
              loadingStatus={loadingStatus}
              onEnviarRelatorioAlmoco={() => enviarRelatorioPorEmail('ALMOCO', true)}
              onEnviarRelatorioXis={() => enviarRelatorioPorEmail('XIS', true)}
            />
            <SpinnerContainer>
            {loading && <LoadingSpinner />}
            </SpinnerContainer>

            <RelatorioTable
              almocosExtra={almocos_ext}
              almocos={almocos}
              reservaXis={reserva_xis}
              loadingAlmocosExtra={loadingAlm_ext}
              loadingAlmoco={loadingAlmoco}
              loadingXis={loadingXis}
              onOpenModalAlmocoExtra={openModalAlm_ext}
              onOpenModalAlmoco={openModalAlmoco}
              onOpenModalXis={openModalXis}
            />
            <ContainerTextFooter>
                <TextDate>QUANTIDADE TOTAL DE ALMOÇOS - {date} = {num_almocos + numAlmocos_ext}<br/><br/><br/></TextDate>
            </ContainerTextFooter>

        <ConfirmDeleteModal
          isOpen={isModalOpenAlmoco}
          onRequestClose={closeModal}
          title="Confirmar exclusão?"
          subtitle={`Você está prestes a excluir a reserva de Almoço: \n\n Nome: ${deleteNome} \n\nTem certeza disso?`}
          loading={loadingAlmoco}
          onConfirm={handleConfirmDeleteAlmoco}
        />

        <ConfirmDeleteModal
          isOpen={isModalOpenXis}
          onRequestClose={closeModal}
          title="Confirmar exclusão?"
          subtitle={`Você está prestes a excluir a reserva de Xis: \n\n Nome: ${deleteNome} \n\n Tem certeza disso?`}
          loading={loadingXis}
          onConfirm={handleConfirmDeleteXis}
        />

        <ConfirmDeleteModal
          isOpen={isModalOpenAlm_ext}
          onRequestClose={closeModal}
          title="Confirmar exclusão?"
          subtitle={`Você está prestes a excluir a reserva de almoço extra: \n\n Nome: ${deleteNome} \n\n Tem certeza disso?`}
          loading={loadingAlm_ext}
          onConfirm={handleConfirmDeleteAlm_ext}
        />

        </Container>
        
    )
}