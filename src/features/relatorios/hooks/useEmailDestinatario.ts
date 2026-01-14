import { useCallback, useEffect, useState } from 'react';
import { api } from '@lib/axios';
import {
  EmailDestinatario,
  EmailDestinatarioPayload,
  EmailDestinatarioTipo,
} from '../types';
import axios from 'axios';

type UseEmailDestinatariosOptions = {
  onSuccessMessage: (message: string) => void;
  onErrorMessage: (message: string) => void;
};

type EmailDestinatarioApi = Omit<EmailDestinatario, 'tipos' | 'ativo'> & {
  tipo?: EmailDestinatarioTipo;
  tipoRelatorio?: EmailDestinatarioTipo;
  tipo_relatorio?: EmailDestinatarioTipo;
  tipos?: EmailDestinatarioTipo;
  ativo?: boolean | number;
};

const normalizeDestinatario = (
  destinatario: EmailDestinatarioApi
): EmailDestinatario => {
  const tipo =
    destinatario.tipo ??
    destinatario.tipoRelatorio ??
    destinatario.tipo_relatorio ??
    destinatario.tipos ??
    'ALMOCO';
  const ativo =
    typeof destinatario.ativo === 'number'
      ? destinatario.ativo === 1
      : Boolean(destinatario.ativo);

  return {
    id: destinatario.id,
    email: destinatario.email,
    nome: destinatario.nome,
    tipos: tipo,
    ativo,
  };
};

const normalizeTipos = (tipos: string) => tipos.trim().toUpperCase();

const mapPayloadToApi = (payload: EmailDestinatarioPayload) => ({
  email: payload.email,
  nome: payload.nome,
  tipos: normalizeTipos(payload.tipos),
  ativo: payload.ativo,
});

export function useEmailDestinatarios({
  onSuccessMessage,
  onErrorMessage,
}: UseEmailDestinatariosOptions) {
  const [destinatarios, setDestinatarios] = useState<EmailDestinatario[]>([]);
  const [loadingDestinatarios, setLoadingDestinatarios] = useState(false);
  const [savingDestinatario, setSavingDestinatario] = useState(false);

  const carregarDestinatarios = useCallback(async () => {
    setLoadingDestinatarios(true);
    try {
      const response = await api.get<EmailDestinatarioApi[]>(
        '/config/email-destinatarios'
      );
      setDestinatarios((response.data ?? []).map(normalizeDestinatario));
    } catch (error) {
      console.error('Erro ao carregar destinatários de e-mail.', error);
      onErrorMessage('Não foi possível carregar os destinatários de e-mail.');
    } finally {
      setLoadingDestinatarios(false);
    }
  }, [onErrorMessage]);

  const criarDestinatario = useCallback(
    async (payload: EmailDestinatarioPayload) => {
      setSavingDestinatario(true);
      try {
        await api.post('/config/email-destinatarios', mapPayloadToApi(payload));
        await carregarDestinatarios();
        onSuccessMessage('Destinatário criado com sucesso!');
      } catch (error) {
        console.error('Erro ao criar destinatário de e-mail.', error);
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          onErrorMessage(error.response.data.message);
        } else {
          onErrorMessage('Não foi possível criar o destinatário de e-mail.');
        }
      } finally {
        setSavingDestinatario(false);
      }
    },
    [carregarDestinatarios, onErrorMessage, onSuccessMessage]
  );

  const atualizarDestinatario = useCallback(
    async (id: number, payload: EmailDestinatarioPayload) => {
      setSavingDestinatario(true);
      try {
        await api.put(
          `/config/email-destinatarios/${id}`,
          mapPayloadToApi(payload)
        );
        await carregarDestinatarios();
        onSuccessMessage('Destinatário atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar destinatário de e-mail.', error);
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          onErrorMessage(error.response.data.message);
        } else {
          onErrorMessage('Não foi possível atualizar o destinatário de e-mail.');
        }
      } finally {
        setSavingDestinatario(false);
      }
    },
    [carregarDestinatarios, onErrorMessage, onSuccessMessage]
  );

  useEffect(() => {
    carregarDestinatarios();
  }, [carregarDestinatarios]);

  return {
    destinatarios,
    loadingDestinatarios,
    savingDestinatario,
    carregarDestinatarios,
    criarDestinatario,
    atualizarDestinatario,
  };
}