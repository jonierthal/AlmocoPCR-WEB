import { useCallback, useEffect, useState } from 'react';
import { api } from '@lib/axios';
import {
  AlmocoExtraType,
  AlmocoType,
  AlmocosPeriodoType,
  ReservaXisPeriodoType,
  ReservaXisType,
} from '../types';
import {
  exportRelatorioAlmoco,
  exportRelatorioPeriodo,
  exportRelatorioXis,
} from '../export';

type UseRelatoriosDataOptions = {
  onSuccessMessage: (message: string) => void;
  onErrorMessage: (message: string) => void;
};

export function useRelatoriosData({
  onSuccessMessage,
  onErrorMessage,
}: UseRelatoriosDataOptions) {
  const [loading, setLoading] = useState(false);
  const [loadingAlmoco, setLoadingAlmoco] = useState(false);
  const [loadingXis, setLoadingXis] = useState(false);
  const [loadingAlm_ext, setLoadingAlm_ext] = useState(false);

  const [almocos, setAlmocos] = useState<AlmocoType[]>([]);
  const [num_almocos, setNum_almocos] = useState(0);
  const [almocos_ext, setAlmocos_ext] = useState<AlmocoExtraType[]>([]);
  const [numAlmocos_ext, setNumAlmocos_ext] = useState(0);
  const [reserva_xis, setReserva_xis] = useState<ReservaXisType[]>([]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const carregaDadosAlmoco = useCallback(async () => {
    setLoadingAlmoco(true);

    await api
      .get('/almocos')
      .then((response) => {
        setAlmocos(response.data.almocos);
        setNum_almocos(response.data.num_almocos);
      })
      .catch((error) => {
        console.error(error);
        // setErrorMessage('Ocorreu um erro ao listar os funcionários. Contate o Administrador!');
      })
      .finally(() => {
        setLoadingAlmoco(false);
      });
  }, []);

  const carregaDadosAlmocoExtra = useCallback(async () => {
    setLoadingAlm_ext(true);

    await api
      .get('/alm_ext')
      .then((response) => {
        setAlmocos_ext(response.data.alm_ext);
        let sum = 0;
        for (const item of response.data.alm_ext) {
          sum += item.quantidade_aext;
        }
        setNumAlmocos_ext(sum);
      })
      .catch((error) => {
        console.error(error);
        // setErrorMessage('Ocorreu um erro ao listar os funcionários. Contate o Administrador!');
      })
      .finally(() => {
        setLoadingAlm_ext(false);
      });
  }, []);

  const carregaDadosReservaXis = useCallback(async () => {
    setLoadingXis(true);

    await api
      .get('/reserva_xis')
      .then((response) => {
        setReserva_xis(response.data.reserva_xis);
      })
      .catch((error) => {
        console.error(error);
        // setErrorMessage('Ocorreu um erro ao listar os funcionários. Contate o Administrador!');
      })
      .finally(() => {
        setLoadingXis(false);
      });
  }, []);

  const handleRelatorioPeriodo = useCallback(async () => {
    if (!startDate || !endDate) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.get('/retorno_rel', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      const dataAlmocosPeriodo: AlmocosPeriodoType[] = response.data.funcionarios;
      const dataAlmocosExtrasPeriodo: AlmocoExtraType[] = response.data.almExts;
      const dataReservaXisPeriodo: ReservaXisPeriodoType[] =
        response.data.funcionarios_xis;
      const total = response.data.total.quantidade_total;

      exportRelatorioPeriodo({
        startDate,
        endDate,
        almocosPeriodo: dataAlmocosPeriodo,
        almocosExtrasPeriodo: dataAlmocosExtrasPeriodo,
        reservaXisPeriodo: dataReservaXisPeriodo,
        total,
      });
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    } finally {
      setLoading(false);
    }
  }, [endDate, startDate]);

  const handleGerarRelatorioXis = useCallback(() => {
    try {
      setLoading(true);
      exportRelatorioXis(reserva_xis);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [reserva_xis]);

  const handleGerarRelatorioAlmoco = useCallback(() => {
    try {
      setLoading(true);
      exportRelatorioAlmoco({
        almocos,
        almocosExtra: almocos_ext,
        numAlmocos: num_almocos,
        numAlmocosExtra: numAlmocos_ext,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [almocos, almocos_ext, numAlmocos_ext, num_almocos]);

  const handleDeleteAlmoco = useCallback(
    async (id: number) => {
      setLoadingAlmoco(true);

      await api
        .delete(`/almocos/${id}`)
        .then(() => {
          carregaDadosAlmoco();
          onSuccessMessage('Almoço excluído com sucesso!');
        })
        .catch((error) => {
          console.error(error);
          onErrorMessage(
            'Ocorreu um erro ao excluir o Almoço. Contate o Administrador!'
          );
        })
        .finally(() => {
          setLoadingAlmoco(false);
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        });
    },
    [carregaDadosAlmoco, onErrorMessage, onSuccessMessage]
  );

  const handleDeleteXis = useCallback(
    async (id: number) => {
      setLoadingXis(true);

      await api
        .delete(`/reservaXis/${id}`)
        .then(() => {
          carregaDadosReservaXis();
          onSuccessMessage('Reserva de Xis excluído com sucesso!');
        })
        .catch((error) => {
          console.error(error);
          onErrorMessage(
            'Ocorreu um erro ao excluir a reserva de Xis. Contate o Administrador!'
          );
        })
        .finally(() => {
          setLoadingXis(false);
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        });
    },
    [carregaDadosReservaXis, onErrorMessage, onSuccessMessage]
  );

  const handleDeleteAlm_ext = useCallback(
    async (id: number) => {
      setLoadingAlm_ext(true);

      await api
        .delete(`/alm_ext/${id}`)
        .then(() => {
          carregaDadosAlmocoExtra();
          onSuccessMessage('Almoço extra excluído com sucesso!');
        })
        .catch((error) => {
          console.error(error);
          onErrorMessage(
            'Ocorreu um erro ao excluir o Almoço extra. Contate o Administrador!'
          );
        })
        .finally(() => {
          setLoadingAlm_ext(false);
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        });
    },
    [carregaDadosAlmocoExtra, onErrorMessage, onSuccessMessage]
  );

  useEffect(() => {
    carregaDadosAlmoco();
    carregaDadosAlmocoExtra();
    carregaDadosReservaXis();
  }, [carregaDadosAlmoco, carregaDadosAlmocoExtra, carregaDadosReservaXis]);

  return {
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
  };
}