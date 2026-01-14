import axios from 'axios';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  EMAIL_DESTINATARIO_PADRAO,
  STORAGE_EMAIL_ADICIONAIS,
} from '../constants';
import { api } from '@lib/axios';
import { RelatorioEmailPayload } from '../types';

type UseRelatoriosEmailOptions = {
  onSuccessMessage: (message: string) => void;
  onErrorMessage: (message: string) => void;
};

type StatusEnvioInfo = {
  status: 'ENVIADO' | 'PENDENTE' | 'FALHA';
  dataHora?: string | null;
  erro?: string | null;
};

type StatusEnvios = {
  almoco: StatusEnvioInfo;
  xis: StatusEnvioInfo;
};

export function useRelatoriosEmail({
  onSuccessMessage,
  onErrorMessage,
}: UseRelatoriosEmailOptions) {
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [emailsAdicionais, setEmailsAdicionais] = useState('');
  const [emailMenuOpen, setEmailMenuOpen] = useState(false);
  const [statusEnvios, setStatusEnvios] = useState<StatusEnvios | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    const emailsSalvos = localStorage.getItem(STORAGE_EMAIL_ADICIONAIS);

    if (emailsSalvos) {
      setEmailsAdicionais(emailsSalvos);
    }
  }, []);

  const obterEmailsAdicionais = useCallback(() => {
    return emailsAdicionais
      .split(/[,;]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);
  }, [emailsAdicionais]);

  const montarPayloadEmail = useCallback((): RelatorioEmailPayload => {
    return {
      destinatarioPadrao: EMAIL_DESTINATARIO_PADRAO,
      destinatariosAdicionais: emailsAdicionais,
      dataReferencia: moment().format('YYYY-MM-DD'),
    };
  }, [emailsAdicionais]);

  const validarEmailsAdicionais = useCallback(() => {
    const emails = obterEmailsAdicionais();
    if (emails.length === 0) {
      return true;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailsInvalidos = emails.filter((email) => !regexEmail.test(email));

    if (emailsInvalidos.length > 0) {
      onErrorMessage(
        `E-mails adicionais inválidos: ${emailsInvalidos.join(', ')}`
      );
      return false;
    }

    return true;
  }, [obterEmailsAdicionais, onErrorMessage]);

  const logEmailErro = useCallback(
    (error: unknown, payload: RelatorioEmailPayload, manual: boolean) => {
      const contextoEnvio = {
        tipoEnvio: manual ? 'manual' : 'automatico',
        dataReferencia: payload.dataReferencia,
        destinatarioPadrao: payload.destinatarioPadrao,
        destinatariosAdicionais: payload.destinatariosAdicionais,
      };

      console.group('Falha ao enviar relatório de reservas por e-mail');
      console.log('Contexto do envio', contextoEnvio);

      if (axios.isAxiosError(error)) {
        console.error('Mensagem', error.message);
        console.error('Status', error.response?.status);
        console.error('Headers', error.response?.headers);
        console.error('Body da resposta', error.response?.data);
        console.error('Requisição', {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        });
      } else {
        console.error('Erro desconhecido', error);
      }

      console.groupEnd();
    },
    []
  );

  const construirMensagemErroEmail = useCallback((error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status) {
      const statusText = error.response?.statusText
        ? ` ${error.response.statusText}`
        : '';
      return `Erro ao enviar o relatório por e-mail (status ${error.response.status}${statusText}). Detalhes disponíveis no console.`;
    }

    return 'Ocorreu um erro ao enviar o relatório de reservas por e-mail. Consulte o console para detalhes.';
  }, []);

  const carregarStatusEnvios = useCallback(async () => {
    setLoadingStatus(true);
    const dataHoje = moment().format('YYYY-MM-DD');

    try {
      const resp = await api.get<StatusEnvios>('/relatorios/status-envios', {
        params: { data: dataHoje },
      });
      setStatusEnvios(resp.data);
    } catch (error) {
      console.error('Erro ao carregar status de envios de e-mail.', error);
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  const enviarRelatorioPorEmail = useCallback(
    async (manual: boolean) => {
      if (!validarEmailsAdicionais()) {
        return;
      }

      setEnviandoEmail(true);
      const payload = montarPayloadEmail();

      try {
        await api.post('/relatorios/email-automatico', payload);
        await carregarStatusEnvios();
        onSuccessMessage(
          manual
            ? 'E-mail de reservas enviado com sucesso!'
            : 'Envio automático do relatório de reservas realizado com sucesso!'
        );
      } catch (error) {
        logEmailErro(error, payload, manual);
        onErrorMessage(construirMensagemErroEmail(error));
      } finally {
        setEnviandoEmail(false);
      }
    },
    [
      carregarStatusEnvios,
      construirMensagemErroEmail,
      logEmailErro,
      montarPayloadEmail,
      onErrorMessage,
      onSuccessMessage,
      validarEmailsAdicionais,
    ]
  );

  const enviarRelatorioXisPorEmail = useCallback(
    async (manual: boolean) => {
      if (!validarEmailsAdicionais()) {
        return;
      }

      setEnviandoEmail(true);
      const payload = montarPayloadEmail();

      try {
        await api.post('/relatorios/xis-email-automatico', payload);
        await carregarStatusEnvios();
        onSuccessMessage(
          manual
            ? 'Relatório de Xis enviado com sucesso!'
            : 'Envio automático do relatório de Xis realizado com sucesso!'
        );
      } catch (error) {
        logEmailErro(error, payload, manual);
        onErrorMessage(construirMensagemErroEmail(error));
      } finally {
        setEnviandoEmail(false);
      }
    },
    [
      carregarStatusEnvios,
      construirMensagemErroEmail,
      logEmailErro,
      montarPayloadEmail,
      onErrorMessage,
      onSuccessMessage,
      validarEmailsAdicionais,
    ]
  );

  const handleSalvarEmailsAdicionais = useCallback(() => {
    localStorage.setItem(STORAGE_EMAIL_ADICIONAIS, emailsAdicionais);
    onSuccessMessage('Destinatários adicionais salvos!');
  }, [emailsAdicionais, onSuccessMessage]);

  const destinatariosResumo = useMemo(() => {
    const emailsAdicionaisLista = obterEmailsAdicionais();
    return emailsAdicionaisLista.length > 0
      ? `${EMAIL_DESTINATARIO_PADRAO} + ${emailsAdicionaisLista.join(', ')}`
      : EMAIL_DESTINATARIO_PADRAO;
  }, [obterEmailsAdicionais]);

  useEffect(() => {
    carregarStatusEnvios();
    const intervalo = setInterval(() => {
      carregarStatusEnvios();
    }, 60000);

    return () => clearInterval(intervalo);
  }, [carregarStatusEnvios]);

  const toggleEmailMenu = useCallback(() => {
    setEmailMenuOpen((open) => !open);
  }, []);

  return {
    emailMenuOpen,
    emailsAdicionais,
    enviandoEmail,
    destinatariosResumo,
    statusEnvios,
    loadingStatus,
    setEmailsAdicionais,
    toggleEmailMenu,
    handleSalvarEmailsAdicionais,
    enviarRelatorioPorEmail,
    enviarRelatorioXisPorEmail,
  };
}