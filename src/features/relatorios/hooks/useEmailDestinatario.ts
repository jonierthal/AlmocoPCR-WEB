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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<EmailDestinatarioApi[]>(
        '/email-destinatarios'
      );
      setDestinatarios((response.data ?? []).map(normalizeDestinatario));
      setSuccess(true)
    } catch (error) {
      console.error('Erro ao carregar destinatários de e-mail.', error);
      const message = 'Não foi possível carregar os destinatários de e-mail.';
      setError(message);
      setSuccess(false);
      onErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }, [onErrorMessage]);

  const criar = useCallback(
    async (payload: EmailDestinatarioPayload) => {
      setSaving(true);
      setError(null);
      try {
        await api.post('/email-destinatarios', mapPayloadToApi(payload));
        await listar();
        setSuccess(true);
        onSuccessMessage('Destinatário criado com sucesso!');
      } catch (error) {
        console.error('Erro ao criar destinatário de e-mail.', error);
        const message =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : 'Não foi possível criar o destinatário de e-mail.';
        setError(message);
        setSuccess(false);
        onErrorMessage(message);
      } finally {
        setSaving(false);
      }
    },
    [listar, onErrorMessage, onSuccessMessage]
  );

  const editar = useCallback(
    async (id: number, payload: EmailDestinatarioPayload) => {
      setSaving(true);
      setError(null);
      try {
        await api.put(
          `/email-destinatarios/${id}`,
          mapPayloadToApi(payload)
        );
        await listar();
        setSuccess(true);
        onSuccessMessage('Destinatário atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar destinatário de e-mail.', error);
        const message =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : 'Não foi possível atualizar o destinatário de e-mail.';
        setError(message);
        setSuccess(false);
        onErrorMessage(message);
      } finally {
        setSaving(false);
      }
    },
    [listar, onErrorMessage, onSuccessMessage]
  );

  useEffect(() => {
    listar();
  }, [listar]);

  const toggleAtivo = useCallback(
    async (destinatario: EmailDestinatario) => {
      await editar(destinatario.id, {
        email: destinatario.email,
        nome: destinatario.nome,
        tipos: destinatario.tipos,
        ativo: !destinatario.ativo,
      });
    },
    [editar]
  );

  const excluir = useCallback(
    async (id: number) => {
      setDeleting(true);
      setError(null);
      try {
        await api.delete(`/email-destinatarios/${id}`);
        await listar();
        setSuccess(true);
        onSuccessMessage('Destinatário excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir destinatário de e-mail.', error);
        let message = 'Não foi possível excluir o destinatário de e-mail.';

        if (axios.isAxiosError(error)) {
          const apiMessage = error.response?.data?.message;
          if (typeof apiMessage === 'string') {
            const normalizedMessage = apiMessage.toLowerCase();
            if (
              normalizedMessage.includes('último destinatário ativo') ||
              normalizedMessage.includes('ultimo destinatario ativo')
            ) {
              message =
                'Não é possível excluir o último destinatário ativo. Cadastre outro destinatário ativo antes de excluir este.';
            } else {
              message = apiMessage;
            }
          }
        }

        setError(message);
        setSuccess(false);
        onErrorMessage(message);
      } finally {
        setDeleting(false);
      }
    },
    [listar, onErrorMessage, onSuccessMessage]
  );

  return {
    destinatarios,
    loading,
    saving,
    deleting,
    success,
    error,
    empty: destinatarios.length === 0,
    listar,
    criar,
    editar,
    toggleAtivo,
    excluir,
  };
}