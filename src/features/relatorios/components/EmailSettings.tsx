import moment from 'moment';
import { useMemo, useState } from 'react';
import {
  AutoEmailContainer,
  AutoEmailContent,
  AutoEmailHeader,
  AutoEmailInput,
  AutoEmailStatus,
  AutoEmailSummary,
  AutoEmailText,
  AutoEmailTitle,
  Button,
  EmailFormActions,
  EmailFormGrid,
  EmailInput,
  EmailLabel,
  EmailRecipientCard,
  EmailRecipientGrid,
  EmailRecipientMeta,
  EmailRecipientRow,
  EmailRecipientValue,
  EmailSelect,
  WarningText,
} from '../pages/Relatorios/styles';
import { EmailDestinatario, EmailDestinatarioPayload } from '../types';

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
  onCriarDestinatario: (payload: EmailDestinatarioPayload) => Promise<void>;
  onAtualizarDestinatario: (
    id: number,
    payload: EmailDestinatarioPayload
  ) => Promise<void>;
  destinatariosExtras: string;
  onChangeDestinatariosExtras: (value: string) => void;
  destinatariosExtrasResumo: string;
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
  onCriarDestinatario,
  onAtualizarDestinatario,
  destinatariosExtras,
  onChangeDestinatariosExtras,
  destinatariosExtrasResumo,
  enviandoEmail,
  statusEnvios,
  loadingStatus,
  onEnviarRelatorioAlmoco,
  onEnviarRelatorioXis,
}: EmailSettingsProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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

  const destinatariosResumo = useMemo(() => {
    return `Almoço ativos: ${destinatariosAtivosAlmoco.length} • Xis ativos: ${destinatariosAtivosXis.length}`;
  }, [destinatariosAtivosAlmoco.length, destinatariosAtivosXis.length]);

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
    const nomeValue = formState.nome.trim();

    if (!emailValue || !nomeValue) {
      setFormError('Preencha e-mail e nome antes de salvar.');
      return;
    }

    if (!validarEmail(emailValue)) {
      setFormError('Informe um e-mail válido.');
      return;
    }

    setFormError('');

    if (editingId) {
      await onAtualizarDestinatario(editingId, {
        ...formState,
        email: emailValue,
        nome: nomeValue,
      });
    } else {
      await onCriarDestinatario({
        ...formState,
        email: emailValue,
        nome: nomeValue,
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
    await onAtualizarDestinatario(destinatario.id, {
      email: destinatario.email,
      nome: destinatario.nome,
      tipos: destinatario.tipos,
      ativo: !destinatario.ativo,
    });
  };

  return (
    <AutoEmailContainer>
      <AutoEmailHeader
        type="button"
        onClick={onToggleMenu}
        aria-expanded={emailMenuOpen}
      >
        <span>Configurações de e-mail</span>
        <span>
          {emailMenuOpen ? EMAIL_AUTO_TOGGLE_TEXT.open : EMAIL_AUTO_TOGGLE_TEXT.closed}
        </span>
      </AutoEmailHeader>
      {!emailMenuOpen && (
        <AutoEmailSummary>
          <span>{destinatariosResumo}</span>
          <span>Almoço: {statusLabelAlmoco}</span>
          <span>Xis: {statusLabelXis}</span>
        </AutoEmailSummary>
      )}
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
                  Nome
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
                  E-mail
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
                <EmailLabel>
                  Status
                  <EmailSelect
                    value={formState.ativo ? 'ativo' : 'inativo'}
                    onChange={(event) =>
                      setFormState((state) => ({
                        ...state,
                        ativo: event.target.value === 'ativo',
                      }))
                    }
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </EmailSelect>
                </EmailLabel>
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
            <EmailRecipientGrid>
              {destinatarios.length === 0 && (
                <AutoEmailText>Nenhum destinatário cadastrado.</AutoEmailText>
              )}
              {destinatarios.map((destinatario) => (
                <EmailRecipientRow key={destinatario.id}>
                  <EmailRecipientMeta>
                    <EmailRecipientValue>
                      {destinatario.nome}
                    </EmailRecipientValue>
                    <EmailRecipientValue>{destinatario.email}</EmailRecipientValue>
                    <EmailRecipientValue>
                      Tipo:{' '}
                      {destinatario.tipos === 'ALMOCO'
                        ? 'Almoço'
                        : destinatario.tipos === 'XIS'
                        ? 'Xis'
                        : 'Ambos'}
                    </EmailRecipientValue>
                    <EmailRecipientValue>
                      {destinatario.ativo ? 'Ativo' : 'Inativo'}
                    </EmailRecipientValue>
                  </EmailRecipientMeta>
                  <EmailFormActions>
                    <Button
                      type="button"
                      onClick={() => handleEdit(destinatario)}
                      disabled={savingDestinatario}
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleToggleAtivo(destinatario)}
                      disabled={savingDestinatario}
                    >
                      {destinatario.ativo ? 'Desativar' : 'Ativar'}
                    </Button>
                  </EmailFormActions>
                </EmailRecipientRow>
              ))}
            </EmailRecipientGrid>
          )}

          <AutoEmailTitle>Envio manual</AutoEmailTitle>
          <AutoEmailText>Enviar também para (opcional)</AutoEmailText>
          <AutoEmailInput
            rows={2}
            value={destinatariosExtras}
            onChange={(event) => onChangeDestinatariosExtras(event.target.value)}
            placeholder="email1@exemplo.com; email2@exemplo.com"
          />
          {destinatariosExtrasResumo && (
            <AutoEmailText>
              Destinatários extras: {destinatariosExtrasResumo}
            </AutoEmailText>
          )}

          <AutoEmailTitle>Status de envio</AutoEmailTitle>
          <AutoEmailStatus>
            Almoço: {statusLabelAlmoco}
            {dataHoraAlmoco ? ` • ${dataHoraAlmoco}` : ''}
          </AutoEmailStatus>
          {erroAlmoco && (
            <AutoEmailStatus>Erro almoço: {erroAlmoco}</AutoEmailStatus>
          )}
          <Button disabled={enviandoEmail} onClick={onEnviarRelatorioAlmoco}>
            {enviandoEmail ? 'Enviando...' : 'Enviar e-mail de teste agora (Almoço)'}
          </Button>

          <AutoEmailStatus>
            Xis: {statusLabelXis}
            {dataHoraXis ? ` • ${dataHoraXis}` : ''}
          </AutoEmailStatus>
          {erroXis && <AutoEmailStatus>Erro Xis: {erroXis}</AutoEmailStatus>}
          <Button disabled={enviandoEmail} onClick={onEnviarRelatorioXis}>
            {enviandoEmail ? 'Enviando...' : 'Enviar e-mail de teste agora (Xis)'}
          </Button>
        </AutoEmailContent>
      )}
    </AutoEmailContainer>
  );
}