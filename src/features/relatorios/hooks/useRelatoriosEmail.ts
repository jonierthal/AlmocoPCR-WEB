import axios from 'axios';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  EMAIL_DESTINATARIO_PADRAO,
  HORARIO_ENVIO_AUTOMATICO_HORA,
  HORARIO_ENVIO_AUTOMATICO_MINUTO,
  HORARIO_ENVIO_XIS_HORA,
  HORARIO_ENVIO_XIS_MINUTO,
  INTERVALO_CHECAGEM_MS,
  STORAGE_DATA_ENVIO,
  STORAGE_DATA_ENVIO_XIS,
  STORAGE_EMAIL_ADICIONAIS,
} from '../constants';
import { api } from '../../../lib/axios';
import { RelatorioEmailPayload } from '../types';

type UseRelatoriosEmailOptions = {
  onSuccessMessage: (message: string) => void;
  onErrorMessage: (message: string) => void;
};

export function useRelatoriosEmail({
  onSuccessMessage,
  onErrorMessage,
}: UseRelatoriosEmailOptions) {
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [ultimaDataEnvio, setUltimaDataEnvio] = useState<string | null>(null);
  const [ultimaDataEnvioXis, setUltimaDataEnvioXis] = useState<string | null>(null);
  const [emailsAdicionais, setEmailsAdicionais] = useState('');
  const [emailMenuOpen, setEmailMenuOpen] = useState(false);

  useEffect(() => {
    const dataSalva = localStorage.getItem(STORAGE_DATA_ENVIO);
    const dataSalvaXis = localStorage.getItem(STORAGE_DATA_ENVIO_XIS);
    const emailsSalvos = localStorage.getItem(STORAGE_EMAIL_ADICIONAIS);

    if (dataSalva) {
      setUltimaDataEnvio(dataSalva);
    }

    if (dataSalvaXis) {
      setUltimaDataEnvioXis(dataSalvaXis);
    }

    if (emailsSalvos) {
      setEmailsAdicionais(emailsSalvos);
    }
  }, []);

  const atualizarDataEnvio = useCallback((dataEnvio: string) => {
    setUltimaDataEnvio(dataEnvio);
    localStorage.setItem(STORAGE_DATA_ENVIO, dataEnvio);
  }, []);

  const atualizarDataEnvioXis = useCallback((dataEnvio: string) => {
    setUltimaDataEnvioXis(dataEnvio);
    localStorage.setItem(STORAGE_DATA_ENVIO_XIS, dataEnvio);
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

  const enviarRelatorioPorEmail = useCallback(
    async (manual: boolean) => {
      if (!validarEmailsAdicionais()) {
        return;
      }

      setEnviandoEmail(true);
      const payload = montarPayloadEmail();

      try {
        await api.post('/relatorios/email-automatico', payload);
        const dataHoje = moment().format('YYYY-MM-DD');
        atualizarDataEnvio(dataHoje);
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
      atualizarDataEnvio,
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
        const dataHoje = moment().format('YYYY-MM-DD');
        atualizarDataEnvioXis(dataHoje);
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
      atualizarDataEnvioXis,
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

  const horarioAlmoco = useMemo(() => {
    return `${String(HORARIO_ENVIO_AUTOMATICO_HORA).padStart(2, '0')}:${String(
      HORARIO_ENVIO_AUTOMATICO_MINUTO
    ).padStart(2, '0')}`;
  }, []);

  const horarioXis = useMemo(() => {
    return `${String(HORARIO_ENVIO_XIS_HORA).padStart(2, '0')}:${String(
      HORARIO_ENVIO_XIS_MINUTO
    ).padStart(2, '0')}`;
  }, []);

  const ultimaDataEnvioFormatada = useMemo(() => {
    return ultimaDataEnvio ? moment(ultimaDataEnvio).format('DD/MM/YYYY') : 'nenhum';
  }, [ultimaDataEnvio]);

  const ultimaDataEnvioXisFormatada = useMemo(() => {
    return ultimaDataEnvioXis
      ? moment(ultimaDataEnvioXis).format('DD/MM/YYYY')
      : 'nenhum';
  }, [ultimaDataEnvioXis]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const agora = moment();
      const dataHoje = agora.format('YYYY-MM-DD');

      if (
        agora.hour() === HORARIO_ENVIO_AUTOMATICO_HORA &&
        agora.minute() === HORARIO_ENVIO_AUTOMATICO_MINUTO &&
        ultimaDataEnvio !== dataHoje
      ) {
        enviarRelatorioPorEmail(false);
      }

      if (
        agora.hour() === HORARIO_ENVIO_XIS_HORA &&
        agora.minute() === HORARIO_ENVIO_XIS_MINUTO &&
        ultimaDataEnvioXis !== dataHoje
      ) {
        enviarRelatorioXisPorEmail(false);
      }
    }, INTERVALO_CHECAGEM_MS);

    return () => clearInterval(intervalo);
  }, [
    enviarRelatorioPorEmail,
    enviarRelatorioXisPorEmail,
    ultimaDataEnvio,
    ultimaDataEnvioXis,
  ]);

  const toggleEmailMenu = useCallback(() => {
    setEmailMenuOpen((open) => !open);
  }, []);

  return {
    emailMenuOpen,
    emailsAdicionais,
    enviandoEmail,
    destinatariosResumo,
    horarioAlmoco,
    horarioXis,
    ultimaDataEnvio,
    ultimaDataEnvioFormatada,
    ultimaDataEnvioXis,
    ultimaDataEnvioXisFormatada,
    setEmailsAdicionais,
    toggleEmailMenu,
    handleSalvarEmailsAdicionais,
    enviarRelatorioPorEmail,
    enviarRelatorioXisPorEmail,
  };
}