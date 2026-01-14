import moment from 'moment';
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
} from '../pages/Relatorios/styles';

const EMAIL_AUTO_TOGGLE_TEXT = {
  closed: 'Mostrar ▼',
  open: 'Esconder ▲',
};

type EmailSettingsProps = {
  emailMenuOpen: boolean;
  onToggleMenu: () => void;
  emailsAdicionais: string;
  onChangeEmailsAdicionais: (value: string) => void;
  onSalvarEmailsAdicionais: () => void;
  destinatariosResumo: string;
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
  emailDestinatarioPadrao: string;
};

export function EmailSettings({
  emailMenuOpen,
  onToggleMenu,
  emailsAdicionais,
  onChangeEmailsAdicionais,
  onSalvarEmailsAdicionais,
  destinatariosResumo,
  enviandoEmail,
  statusEnvios,
  loadingStatus,
  onEnviarRelatorioAlmoco,
  onEnviarRelatorioXis,
  emailDestinatarioPadrao,
}: EmailSettingsProps) {
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

  return (
    <AutoEmailContainer>
      <AutoEmailHeader
        type="button"
        onClick={onToggleMenu}
        aria-expanded={emailMenuOpen}
      >
        <span>Automação de e-mails</span>
        <span>
          {emailMenuOpen ? EMAIL_AUTO_TOGGLE_TEXT.open : EMAIL_AUTO_TOGGLE_TEXT.closed}
        </span>
      </AutoEmailHeader>
      {!emailMenuOpen && (
        <AutoEmailSummary>
          <span>Destinatário padrão: {emailDestinatarioPadrao}</span>
          <span>Almoço: {statusLabelAlmoco}</span>
          <span>Xis: {statusLabelXis}</span>
        </AutoEmailSummary>
      )}
      {emailMenuOpen && (
        <AutoEmailContent>
          <AutoEmailTitle>Destinatários</AutoEmailTitle>
          <AutoEmailText>
            Destinatário padrão (sempre recebe): {emailDestinatarioPadrao}
          </AutoEmailText>
          <AutoEmailText>
            Destinatários adicionais (separe por vírgula ou ponto e vírgula)
          </AutoEmailText>
          <AutoEmailInput
            rows={3}
            value={emailsAdicionais}
            onChange={(event) => onChangeEmailsAdicionais(event.target.value)}
            placeholder="email1@exemplo.com; email2@exemplo.com"
          />
          <Button type="button" onClick={onSalvarEmailsAdicionais}>
            Salvar destinatários adicionais
          </Button>
          <AutoEmailText>Serão enviados para: {destinatariosResumo}</AutoEmailText>

          <AutoEmailTitle>Automação de e-mails</AutoEmailTitle>
          <AutoEmailStatus>
            Almoço: {statusLabelAlmoco}
            {dataHoraAlmoco ? ` • ${dataHoraAlmoco}` : ''}
          </AutoEmailStatus>
          {erroAlmoco && (
            <AutoEmailStatus>Erro almoço: {erroAlmoco}</AutoEmailStatus>
          )}
          <Button disabled={enviandoEmail} onClick={onEnviarRelatorioAlmoco}>
             {enviandoEmail ? 'Enviando...' : 'Enviar teste Almoço agora'}
          </Button>

          <AutoEmailStatus>
            Xis: {statusLabelXis}
            {dataHoraXis ? ` • ${dataHoraXis}` : ''}
          </AutoEmailStatus>
          {erroXis && <AutoEmailStatus>Erro Xis: {erroXis}</AutoEmailStatus>}
          <Button disabled={enviandoEmail} onClick={onEnviarRelatorioXis}>
            {enviandoEmail ? 'Enviando...' : 'Enviar teste Xis agora'}
          </Button>
        </AutoEmailContent>
      )}
    </AutoEmailContainer>
  );
}