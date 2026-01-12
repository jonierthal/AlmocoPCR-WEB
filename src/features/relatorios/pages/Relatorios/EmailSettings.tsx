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
} from './styles';

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
  ultimaDataEnvio: string | null;
  ultimaDataEnvioFormatada: string;
  ultimaDataEnvioXis: string | null;
  ultimaDataEnvioXisFormatada: string;
  enviandoEmail: boolean;
  horarioAlmoco: string;
  horarioXis: string;
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
  ultimaDataEnvio,
  ultimaDataEnvioFormatada,
  ultimaDataEnvioXis,
  ultimaDataEnvioXisFormatada,
  enviandoEmail,
  horarioAlmoco,
  horarioXis,
  onEnviarRelatorioAlmoco,
  onEnviarRelatorioXis,
  emailDestinatarioPadrao,
}: EmailSettingsProps) {
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
          <span>Último envio almoço: {ultimaDataEnvioFormatada}</span>
          <span>Último envio xis: {ultimaDataEnvioXisFormatada}</span>
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

          <AutoEmailTitle>Almoço</AutoEmailTitle>
          <AutoEmailText>Envio automático diário às {horarioAlmoco}</AutoEmailText>
          <AutoEmailStatus>
            {ultimaDataEnvio
              ? `Último envio registrado: ${ultimaDataEnvioFormatada}`
              : 'Nenhum envio registrado ainda.'}
          </AutoEmailStatus>
          <Button disabled={enviandoEmail} onClick={onEnviarRelatorioAlmoco}>
            {enviandoEmail ? 'Enviando...' : 'Enviar e-mail de almoço de teste agora'}
          </Button>

          <AutoEmailTitle>Xis</AutoEmailTitle>
          <AutoEmailText>Envio automático diário às {horarioXis}</AutoEmailText>
          <AutoEmailStatus>
            {ultimaDataEnvioXis
              ? `Último envio registrado: ${ultimaDataEnvioXisFormatada}`
              : 'Nenhum envio registrado ainda.'}
          </AutoEmailStatus>
          <Button disabled={enviandoEmail} onClick={onEnviarRelatorioXis}>
            {enviandoEmail ? 'Enviando...' : 'Enviar e-mail de Xis de teste agora'}
          </Button>
        </AutoEmailContent>
      )}
    </AutoEmailContainer>
  );
}