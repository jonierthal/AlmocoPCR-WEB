import axios from 'axios';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@lib/axios';
import { EmailDestinatarioTipo, RelatorioEmailPayload } from '../types';

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

const EMAIL_MENU_STORAGE_KEY = 'relatorios-email-menu-open';

export function useRelatoriosEmail({
  onSuccessMessage,
  onErrorMessage,
}: UseRelatoriosEmailOptions) {
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [destinatariosExtras, setDestinatariosExtras] = useState('');
  const [emailMenuOpen, setEmailMenuOpen] = useState(() => {
    const storedValue = localStorage.getItem(EMAIL_MENU_STORAGE_KEY);
    return storedValue ? storedValue === 'true' : false;
  });
  const [statusEnvios, setStatusEnvios] = useState<StatusEnvios | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const obterDestinatariosExtras = useCallback(() => {
    return destinatariosExtras
      .split(/[,;]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);
  }, [destinatariosExtras]);

  const montarPayloadEmail = useCallback(
    (tipoRelatorio: EmailDestinatarioTipo): RelatorioEmailPayload => {
      const extras = obterDestinatariosExtras();
      return {
        tipoRelatorio,
        dataReferencia: moment().format('YYYY-MM-DD'),
        ...(extras.length > 0 ? { destinatariosExtras: extras } : {}),
      };
    },
    [obterDestinatariosExtras]
  );

  const validarDestinatariosExtras = useCallback(() => {
    const emails = obterDestinatariosExtras();
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
  }, [obterDestinatariosExtras, onErrorMessage]);

  const logEmailErro = useCallback(
    (
      error: unknown,
      payload: RelatorioEmailPayload,
      manual: boolean
    ) => {
      const contextoEnvio = {
        tipoEnvio: manual ? 'manual' : 'automatico',
        dataReferencia: payload.dataReferencia,
        tipoRelatorio: payload.tipoRelatorio,
        destinatariosExtras: payload.destinatariosExtras ?? [],
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

  const construirMensagemErroEmail = useCallback(
    (error: unknown, tipoRelatorio: EmailDestinatarioTipo) => {
      if (axios.isAxiosError(error) && error.response?.status) {
        if (error.response.status === 422) {
          const label =
            tipoRelatorio === 'ALMOCO' ? 'almoço' : 'xis';
          return `Nenhum destinatário ativo configurado para relatório de ${label}. Cadastre ao menos um.`;
        }

        const statusText = error.response?.statusText
          ? ` ${error.response.statusText}`
          : '';
        return `Erro ao enviar o relatório por e-mail (status ${error.response.status}${statusText}). Detalhes disponíveis no console.`;
      }

    return 'Ocorreu um erro ao enviar o relatório de reservas por e-mail. Consulte o console para detalhes.';
    },
    []
  );

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
    async (tipoRelatorio: EmailDestinatarioTipo, manual: boolean) => {
      if (!validarDestinatariosExtras()) {
        return;
      }

      setEnviandoEmail(true);
      const payload = montarPayloadEmail(tipoRelatorio);
      const endpoint = manual
        ? '/relatorios/email-manual'
        : '/relatorios/email-automatico';

      try {
       await api.post(endpoint, payload);
        if (!manual) {
          await carregarStatusEnvios();
        }
        onSuccessMessage(
          manual
            ? `E-mail de ${
                tipoRelatorio === 'ALMOCO' ? 'almoço' : 'xis'
              } enviado com sucesso!`
            : 'Envio automático do relatório de reservas realizado com sucesso!'
        );
      } catch (error) {
        logEmailErro(error, payload, manual);
        onErrorMessage(construirMensagemErroEmail(error, tipoRelatorio));
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
      validarDestinatariosExtras,
    ]
  );

  useEffect(() => {
    carregarStatusEnvios();
    const intervalo = setInterval(() => {
      carregarStatusEnvios();
    }, 60000);

    return () => clearInterval(intervalo);
  }, [carregarStatusEnvios]);

  const toggleEmailMenu = useCallback(() => {
    setEmailMenuOpen((open) => {
      const nextValue = !open;
      localStorage.setItem(EMAIL_MENU_STORAGE_KEY, String(nextValue));
      return nextValue;
    });
  }, []);

  const destinatariosExtrasResumo = useMemo(() => {
    const extras = obterDestinatariosExtras();
    return extras.join(', ');
  }, [obterDestinatariosExtras]);

  return {
    emailMenuOpen,
    destinatariosExtras,
    destinatariosExtrasResumo,
    enviandoEmail,
    statusEnvios,
    loadingStatus,
    setDestinatariosExtras,
    toggleEmailMenu,
    enviarRelatorioPorEmail,
  };
}