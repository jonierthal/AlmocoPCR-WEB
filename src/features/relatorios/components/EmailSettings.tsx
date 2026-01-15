import moment from 'moment';
import { useMemo, useState } from 'react';
import {
  AutoEmailContainer,
  AutoEmailContent,
  AutoEmailHeader,
  AutoEmailHeaderSummary,
  AutoEmailHeaderTitle,
  AutoEmailHeaderTop,
  AutoEmailStatus,
  AutoEmailText,
  AutoEmailTitle,
  Button,
  EmailFormActions,
  EmailFormGrid,
  EmailInput,
  EmailLabel,
  EmailRecipientCard,
  EmailRecipientCell,
  EmailRecipientHeaderCell,
  EmailRecipientRow,
  EmailRecipientTable,
  EmailSelect,
  EmailSwitch,
  EmailSwitchLabel,
  EmailTableActions,
  EmailTableWrapper,
  EmailToggleButton,
  EmailDeleteButton,
  WarningText,
} from '../pages/Relatorios/styles';
import { EmailDestinatario, EmailDestinatarioPayload } from '../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

const EMAIL_AUTO_TOGGLE_TEXT = {
  closed: 'Mostrar ▼',
  open: 'Esconder ▲',
};

type EmailSettingsProps = {
  emailMenuOpen: boolean;
  onToggleMenu: () => void;
  destinatarios: EmailDestinatario[];
  loadingDestinatarios: boolean;
  savingDestinatario: boolean;
  deletingDestinatario: boolean;
  emptyDestinatarios: boolean;
  onCriarDestinatario: (payload: EmailDestinatarioPayload) => Promise<void>;
  onEditarDestinatario: (
    id: number,
    payload: EmailDestinatarioPayload
  ) => Promise<void>;
  onToggleAtivo: (destinatario: EmailDestinatario) => Promise<void>;
  onExcluirDestinatario: (id: number) => Promise<void>;
  enviandoEmail: boolean;
  statusEnvios: {
    almoco: {
      status: 'ENVIADO' | 'PENDENTE' | 'FALHA';
      dataHora?: string | null;
      erro?: string | null;
    };
    xis: {
      status: 'ENVIADO' | 'PENDENTE' | 'FALHA';
      dataHora?: string | null;
      erro?: string | null;
    };
  } | null;
  loadingStatus: boolean;
  onEnviarRelatorioAlmoco: () => void;
  onEnviarRelatorioXis: () => void;
};

const defaultFormState: EmailDestinatarioPayload = {
  email: '',
  nome: '',
  tipos: 'ALMOCO',
  ativo: true,
};

export function EmailSettings({
  emailMenuOpen,
  onToggleMenu,
  destinatarios,
  loadingDestinatarios,
  savingDestinatario,
  deletingDestinatario,
  emptyDestinatarios,
  onCriarDestinatario,
  onEditarDestinatario,
  onToggleAtivo,
  onExcluirDestinatario,
  enviandoEmail,
  statusEnvios,
  loadingStatus,
  onEnviarRelatorioAlmoco,
  onEnviarRelatorioXis,
}: EmailSettingsProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EmailDestinatario | null>(
    null
  );
  const [formState, setFormState] = useState<EmailDestinatarioPayload>(
    defaultFormState
  );
  const [formError, setFormError] = useState('');

  const formatarDataHora = (dataHora?: string | null) => {
    if (!dataHora) {
      return null;
    }
    return moment(dataHora).format('DD/MM/YYYY HH:mm');
  };

  const statusAlmoco = statusEnvios?.almoco;
  const statusXis = statusEnvios?.xis;
  const statusLabelAlmoco = loadingStatus
    ? 'Carregando...'
    : statusAlmoco?.status ?? 'Indisponível';
  const statusLabelXis = loadingStatus
    ? 'Carregando...'
    : statusXis?.status ?? 'Indisponível';
  const dataHoraAlmoco = formatarDataHora(statusAlmoco?.dataHora);
  const dataHoraXis = formatarDataHora(statusXis?.dataHora);
  const erroAlmoco = statusAlmoco?.status === 'FALHA' ? statusAlmoco?.erro : null;
  const erroXis = statusXis?.status === 'FALHA' ? statusXis?.erro : null;

  const destinatariosAtivosAlmoco = useMemo(
    () =>
      destinatarios.filter(
        (destinatario) =>
          ['ALMOCO', 'AMBOS'].includes(destinatario.tipos) && destinatario.ativo
      ),
    [destinatarios]
  );
  const destinatariosAtivosXis = useMemo(
    () =>
      destinatarios.filter(
        (destinatario) =>
          ['XIS', 'AMBOS'].includes(destinatario.tipos) && destinatario.ativo
      ),
    [destinatarios]
  );

  const resetForm = () => {
    setFormState(defaultFormState);
    setEditingId(null);
    setFormError('');
    setFormOpen(false);
  };

  const validarEmail = (email: string) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email.trim());
  };

  const handleSubmit = async () => {
    const emailValue = formState.email.trim();

    if (!emailValue) {
      setFormError('Preencha o e-mail antes de salvar.');
      return;
    }

    if (!validarEmail(emailValue)) {
      setFormError('Informe um e-mail válido.');
      return;
    }

    setFormError('');

    if (editingId) {
      await onEditarDestinatario(editingId, {
        ...formState,
        email: emailValue,
        nome: formState.nome.trim(),
      });
    } else {
      await onCriarDestinatario({
        ...formState,
        email: emailValue,
        nome: formState.nome.trim(),
      });
    }

    resetForm();
  };

  const handleEdit = (destinatario: EmailDestinatario) => {
    setFormState({
      email: destinatario.email,
      nome: destinatario.nome,
      tipos: destinatario.tipos,
      ativo: destinatario.ativo,
    });
    setEditingId(destinatario.id);
    setFormError('');
    setFormOpen(true);
  };

  const handleToggleAtivo = async (destinatario: EmailDestinatario) => {
    await onToggleAtivo(destinatario);
  };

  const handleDelete = (destinatario: EmailDestinatario) => {
    setDeleteTarget(destinatario);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    await onExcluirDestinatario(deleteTarget.id);
    setDeleteTarget(null);
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
  };

  return (
    <AutoEmailContainer>
      <AutoEmailHeader
        type="button"
        onClick={onToggleMenu}
        aria-expanded={emailMenuOpen}
      >
        <AutoEmailHeaderTop>
          <AutoEmailHeaderTitle>Configurações de e-mail</AutoEmailHeaderTitle>
          <AutoEmailHeaderSummary>
            <span>
              Almoço: {destinatariosAtivosAlmoco.length} destinatários ativos
            </span>
            <span>
              Xis: {destinatariosAtivosXis.length} destinatários ativos
            </span>
          </AutoEmailHeaderSummary>
        </AutoEmailHeaderTop>
        <span>
          {emailMenuOpen ? EMAIL_AUTO_TOGGLE_TEXT.open : EMAIL_AUTO_TOGGLE_TEXT.closed}
        </span>
      </AutoEmailHeader>
      {emailMenuOpen && (
        <AutoEmailContent>
          <AutoEmailTitle>Destinatários cadastrados</AutoEmailTitle>
          {destinatariosAtivosAlmoco.length === 0 && (
            <WarningText>
              Nenhum destinatário configurado para relatório de almoço. Cadastre ao
              menos um.
            </WarningText>
          )}
          {destinatariosAtivosXis.length === 0 && (
            <WarningText>
              Nenhum destinatário configurado para relatório de Xis. Cadastre ao
              menos um.
            </WarningText>
          )}
          <AutoEmailText>
            Estes destinatários serão usados no envio automático e manual.
          </AutoEmailText>
          <Button
            type="button"
            onClick={() => {
              setFormOpen((open) => !open);
              setFormError('');
              if (!formOpen) {
                setEditingId(null);
                setFormState(defaultFormState);
              }
            }}
            disabled={savingDestinatario}
          >
            {formOpen ? 'Fechar formulário' : 'Adicionar destinatário'}
          </Button>
          {formOpen && (
            <EmailRecipientCard>
              <EmailFormGrid>
                <EmailLabel>
                  Nome (opcional)
                  <EmailInput
                    value={formState.nome}
                    onChange={(event) =>
                      setFormState((state) => ({
                        ...state,
                        nome: event.target.value,
                      }))
                    }
                    placeholder="Nome do destinatário"
                  />
                </EmailLabel>
                <EmailLabel>
                  E-mail (obrigatório)
                  <EmailInput
                    value={formState.email}
                    onChange={(event) =>
                      setFormState((state) => ({
                        ...state,
                        email: event.target.value,
                      }))
                    }
                    placeholder="email@exemplo.com"
                  />
                </EmailLabel>
                <EmailLabel>
                  Tipo de relatório
                  <EmailSelect
                    value={formState.tipos}
                    onChange={(event) =>
                      setFormState((state) => ({
                        ...state,
                        tipos: event.target.value as EmailDestinatario['tipos'],
                      }))
                    }
                  >
                    <option value="ALMOCO">Almoço</option>
                    <option value="XIS">Xis</option>
                    <option value="AMBOS">Ambos</option>
                  </EmailSelect>
                </EmailLabel>
                <EmailSwitchLabel>
                  <EmailSwitch
                    type="checkbox"
                    checked={formState.ativo}
                    onChange={(event) =>
                      setFormState((state) => ({
                        ...state,
                        ativo: event.target.checked,
                      }))
                    }
                  />
                  Ativo
                </EmailSwitchLabel>
              </EmailFormGrid>
              {formError && <WarningText>{formError}</WarningText>}
              <EmailFormActions>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={savingDestinatario}
                >
                  {savingDestinatario
                    ? 'Salvando...'
                    : editingId
                    ? 'Atualizar destinatário'
                    : 'Salvar destinatário'}
                </Button>
                <Button type="button" onClick={resetForm} disabled={savingDestinatario}>
                  Cancelar
                </Button>
              </EmailFormActions>
            </EmailRecipientCard>
          )}

          {loadingDestinatarios ? (
            <AutoEmailText>Carregando destinatários...</AutoEmailText>
          ) : (
            <EmailTableWrapper>
              {emptyDestinatarios ? (
                <AutoEmailText>Nenhum destinatário cadastrado.</AutoEmailText>
              ) : (
                <EmailRecipientTable>
                  <thead>
                    <EmailRecipientRow>
                      <EmailRecipientHeaderCell>Email</EmailRecipientHeaderCell>
                      <EmailRecipientHeaderCell>Nome</EmailRecipientHeaderCell>
                      <EmailRecipientHeaderCell>Tipo</EmailRecipientHeaderCell>
                      <EmailRecipientHeaderCell>Status</EmailRecipientHeaderCell>
                      <EmailRecipientHeaderCell>Ações</EmailRecipientHeaderCell>
                    </EmailRecipientRow>
                  </thead>
                  <tbody>
                    {destinatarios.map((destinatario) => (
                      <EmailRecipientRow key={destinatario.id}>
                        <EmailRecipientCell>{destinatario.email}</EmailRecipientCell>
                        <EmailRecipientCell>
                          {destinatario.nome || '—'}
                        </EmailRecipientCell>
                        <EmailRecipientCell>
                          {destinatario.tipos === 'ALMOCO'
                            ? 'ALMOCO'
                            : destinatario.tipos === 'XIS'
                            ? 'XIS'
                            : 'AMBOS'}
                        </EmailRecipientCell>
                        <EmailRecipientCell>
                          {destinatario.ativo ? 'Ativo' : 'Inativo'}
                        </EmailRecipientCell>
                        <EmailRecipientCell>
                          <EmailTableActions>
                            <Button
                              type="button"
                              onClick={() => handleEdit(destinatario)}
                              disabled={savingDestinatario || deletingDestinatario}
                            >
                              Editar
                            </Button>
                            <EmailToggleButton
                              type="button"
                              onClick={() => handleToggleAtivo(destinatario)}
                              disabled={savingDestinatario || deletingDestinatario}
                            >
                              {destinatario.ativo ? 'Inativar' : 'Ativar'}
                            </EmailToggleButton>
                            <EmailDeleteButton
                              type="button"
                              onClick={() => handleDelete(destinatario)}
                              disabled={savingDestinatario || deletingDestinatario}
                            >
                              Excluir
                            </EmailDeleteButton>
                          </EmailTableActions>
                        </EmailRecipientCell>
                      </EmailRecipientRow>
                    ))}
                  </tbody>
                </EmailRecipientTable>
              )}
            </EmailTableWrapper>
          )}

          <AutoEmailTitle>Status de envio</AutoEmailTitle>
          <AutoEmailStatus>
            Almoço: {statusLabelAlmoco}
            {dataHoraAlmoco ? ` • ${dataHoraAlmoco}` : ''}
          </AutoEmailStatus>
          {erroAlmoco && (
            <AutoEmailStatus>Erro almoço: {erroAlmoco}</AutoEmailStatus>
          )}
          <Button onClick={onEnviarRelatorioAlmoco}>
            {enviandoEmail ? 'Enviando...' : 'Enviar e-mail (Almoço)'}
          </Button>

          <AutoEmailStatus>
            Xis: {statusLabelXis}
            {dataHoraXis ? ` • ${dataHoraXis}` : ''}
          </AutoEmailStatus>
          {erroXis && <AutoEmailStatus>Erro Xis: {erroXis}</AutoEmailStatus>}
          <Button onClick={onEnviarRelatorioXis}>
            {enviandoEmail ? 'Enviando...' : 'Enviar e-mail(Xis)'}
          </Button>
        </AutoEmailContent>
      )}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        onRequestClose={closeDeleteModal}
        title="Confirmar exclusão?"
        subtitle={`Você está prestes a excluir o destinatário: ${
          deleteTarget?.nome || deleteTarget?.email || ''
        }.\n\nTem certeza disso?`}
        loading={deletingDestinatario}
        onConfirm={handleConfirmDelete}
      />
    </AutoEmailContainer>
  );
}