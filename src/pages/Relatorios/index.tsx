import {
  Button,
  ButtonContainer,
  ButtonDateIntervalContainer,
  ButtonRed,
  Container,
  ContainerTextFooter,
  DateContainer,
  RelatoriosContainer,
  SpinnerContainer,
  StyledDatePicker,
  TextDate,
  TextDateContainer,
} from './styles';
import { ButonContainer, ButtonGreen, ContainerModal, StyledAlert, TextAlertContainer } from "../ManutFuncionarios/styles";
import axios from 'axios' ;
import { BiMoveHorizontal } from 'react-icons/bi';
import { useEffect, useState } from "react";
import { ColorRing } from 'react-loader-spinner'
import moment from 'moment';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from "../../lib/axios";
import { Title } from "../../components/Title/styles";
import { SubtitleComp } from "../../components/Subtitle";
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
} from './constants';
import {
  exportRelatorioAlmoco,
  exportRelatorioPeriodo,
  exportRelatorioXis,
} from './export';
import { EmailSettings } from './EmailSettings';
import { RelatorioTable } from './RelatorioTable';
import {
  AlmocoExtraType,
  AlmocoType,
  AlmocosPeriodoType,
  RelatorioEmailPayload,
  ReservaXisPeriodoType,
  ReservaXisType,
} from './types';

// Registra o locale para Português (Brasil)
registerLocale('pt-BR', ptBR);
// Define o locale padrão como Português (Brasil)
setDefaultLocale('pt-BR');

  export function Relatorios(){
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingAlmoco, setLoadingAlmoco] = useState<boolean>(false)
    const [loadingXis, setLoadingXis] = useState<boolean>(false)
    const [loadingAlm_ext, setLoadingAlm_ext] = useState<boolean>(false)
    const [enviandoEmail, setEnviandoEmail] = useState<boolean>(false)
    const [almocos, setAlmocos] = useState<AlmocoType[]>([])
    const [num_almocos, setNum_almocos] = useState<number>(0)
    const [almocos_ext, setAlmocos_ext] = useState<AlmocoExtraType[]>([])
    const [numAlmocos_ext, setNumAlmocos_ext] = useState<number>(0)
    const [reserva_xis, setReserva_xis] = useState<ReservaXisType[]>([])
    const [ultimaDataEnvio, setUltimaDataEnvio] = useState<string | null>(null)
    const [ultimaDataEnvioXis, setUltimaDataEnvioXis] = useState<string | null>(null)
    const [emailsAdicionais, setEmailsAdicionais] = useState<string>('')
    const [emailMenuOpen, setEmailMenuOpen] = useState<boolean>(false)

    const [isModalOpenAlmoco, setIsModalOpenAlmoco] = useState<boolean>(false);
    const [isModalOpenXis, setIsModalOpenXis] = useState<boolean>(false);
    const [isModalOpenAlm_ext, setIsModalOpenAlm_ext] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleteNome, setDeleteNome] = useState<string>('');

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

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

    let date = moment().format('DD/MM/YYYY');

    function atualizarDataEnvio(dataEnvio: string) {
      setUltimaDataEnvio(dataEnvio);
      localStorage.setItem(STORAGE_DATA_ENVIO, dataEnvio);
    }

    function atualizarDataEnvioXis(dataEnvio: string) {
      setUltimaDataEnvioXis(dataEnvio);
      localStorage.setItem(STORAGE_DATA_ENVIO_XIS, dataEnvio);
    }

    function montarPayloadEmail(): RelatorioEmailPayload {
      return {
        destinatarioPadrao: EMAIL_DESTINATARIO_PADRAO,
        destinatariosAdicionais: emailsAdicionais,
        dataReferencia: moment().format('YYYY-MM-DD'),
      };
    }

    function obterEmailsAdicionais(): string[] {
      return emailsAdicionais
        .split(/[,;]+/)
        .map((email) => email.trim())
        .filter((email) => email.length > 0);
    }

    function validarEmailsAdicionais(): boolean {
      const emails = obterEmailsAdicionais();
      if (emails.length === 0) {
        return true;
      }

      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailsInvalidos = emails.filter((email) => !regexEmail.test(email));

      if (emailsInvalidos.length > 0) {
        setErrorMessage(`E-mails adicionais inválidos: ${emailsInvalidos.join(', ')}`);
        setTimeout(() => {
          setErrorMessage('');
        }, 4000);
        return false;
      }

      return true;
    }

    function logEmailErro(error: unknown, payload: RelatorioEmailPayload, manual: boolean) {
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
    }

    function construirMensagemErroEmail(error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status) {
        const statusText = error.response?.statusText ? ` ${error.response.statusText}` : '';
        return `Erro ao enviar o relatório por e-mail (status ${error.response.status}${statusText}). Detalhes disponíveis no console.`;
      }

      return 'Ocorreu um erro ao enviar o relatório de reservas por e-mail. Consulte o console para detalhes.';
    }

    async function enviarRelatorioPorEmail(manual: boolean) {
      if (!validarEmailsAdicionais()) {
        return;
      }

      setEnviandoEmail(true);
      const payload = montarPayloadEmail();

      try {
        await api.post('/relatorios/email-automatico', payload);
        const dataHoje = moment().format('YYYY-MM-DD');
        atualizarDataEnvio(dataHoje);
        setSuccessMessage(manual ? 'E-mail de reservas enviado com sucesso!' : 'Envio automático do relatório de reservas realizado com sucesso!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 4000);
      } catch (error) {
        logEmailErro(error, payload, manual);
        setErrorMessage(construirMensagemErroEmail(error));
        setTimeout(() => {
          setErrorMessage('');
        }, 4000);
      } finally {
        setEnviandoEmail(false);
      }
    }

    async function enviarRelatorioXisPorEmail(manual: boolean) {
      if (!validarEmailsAdicionais()) {
        return;
      }

      setEnviandoEmail(true);
      const payload = montarPayloadEmail();

      try {
        await api.post('/relatorios/xis-email-automatico', payload);
        const dataHoje = moment().format('YYYY-MM-DD');
        atualizarDataEnvioXis(dataHoje);
        setSuccessMessage(manual ? 'Relatório de Xis enviado com sucesso!' : 'Envio automático do relatório de Xis realizado com sucesso!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 4000);
      } catch (error) {
        logEmailErro(error, payload, manual);
        setErrorMessage(construirMensagemErroEmail(error));
        setTimeout(() => {
          setErrorMessage('');
        }, 4000);
      } finally {
        setEnviandoEmail(false);
      }
    }

    function handleSalvarEmailsAdicionais() {
      localStorage.setItem(STORAGE_EMAIL_ADICIONAIS, emailsAdicionais);
      setSuccessMessage('Destinatários adicionais salvos!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    }

    function handleRelatorioPeriodo() {
      if (startDate && endDate) {
        // Converte as datas para o formato desejado (se necessário)
        const startDateString = startDate.toISOString();
        const endDateString = endDate.toISOString();
    
        // Aqui você pode chamar a API para buscar os dados com as datas selecionadas
        api.get('/retorno_rel', {
          params: {
            startDate: startDateString,
            endDate: endDateString
          }
        })
          .then((response) => {
            setLoading(true);

            const dataAlmocosPeriodo: AlmocosPeriodoType[] = response.data.funcionarios;
            const dataAlmocosExtrasPeriodo: AlmocoExtraType[] = response.data.almExts;
            const dataReservaXisPeriodo: ReservaXisPeriodoType[] = response.data.funcionarios_xis;
            const total = response.data.total.quantidade_total;

            exportRelatorioPeriodo({
              startDate,
              endDate,
              almocosPeriodo: dataAlmocosPeriodo,
              almocosExtrasPeriodo: dataAlmocosExtrasPeriodo,
              reservaXisPeriodo: dataReservaXisPeriodo,
              total,
            });

          })
          .catch((error) => {
            console.error('Erro ao buscar os dados:', error);
          })
          .finally(() => {
            setLoading(false); // define loading como false após a requisição ter sido concluída (com sucesso ou erro)
          });
      }
    }

    function handleGerarRelatorioXis() {
      //depeja na constante reserva os dados a serem inseridos
      try {
        setLoading(true)

        exportRelatorioXis(reserva_xis);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false)
      }

    }

    function handleGerarRelatorioAlmoco() {

    try{    
      setLoading(true)

      exportRelatorioAlmoco({
        almocos,
        almocosExtra: almocos_ext,
        numAlmocos: num_almocos,
        numAlmocosExtra: numAlmocos_ext,
      });
      }  
      catch(error){
        console.log(error);
      }
      finally{
        setLoading(false);
      }
    }

    async function handleDeleteAlmoco(id: number)  {
      setLoadingAlmoco(true);
  
      await api.delete(`/almocos/${id}`)
        .then(response => {
          carregaDadosAlmoco();
          setSuccessMessage('Almoço excluído com sucesso!');
          setTimeout(() => {
            setSuccessMessage('');
          }, 4000);
        })
        .catch(error => {
          console.error(error);
          setErrorMessage('Ocorreu um erro ao excluir o Almoço. Contate o Administrador!');
          setTimeout(() => {
            setErrorMessage('');
          }, 4000);
        })
        .finally(() => {
          setLoadingAlmoco(false);
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      closeModal();
    };

    async function handleDeleteXis(id: number)  {
      setLoadingXis(true);
  
      await api.delete(`/reservaXis/${id}`)
        .then(response => {
          carregaDadosReservaXis();
          setSuccessMessage('Reserva de Xis excluído com sucesso!');
          setTimeout(() => {
            setSuccessMessage('');
          }, 4000);
        })
        .catch(error => {
          console.error(error);
          setErrorMessage('Ocorreu um erro ao excluir a reserva de Xis. Contate o Administrador!');
          setTimeout(() => {
            setErrorMessage('');
          }, 4000);
        })
        .finally(() => {
          setLoadingXis(false);
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      closeModal();
    };

    async function handleDeleteAlm_ext(id: number)  {
      setLoadingAlm_ext(true);

      await api.delete(`/alm_ext/${id}`)
        .then(response => {
          carregaDadosAlmocoExtra();
          setSuccessMessage('Almoço extra excluído com sucesso!');
          setTimeout(() => {
            setSuccessMessage('');
          }, 4000);
        })
        .catch(error => {
          console.error(error);
          setErrorMessage('Ocorreu um erro ao excluir o Almoço extra. Contate o Administrador!');
          setTimeout(() => {
            setErrorMessage('');
          }, 4000);
        })
        .finally(() => {
          setLoadingAlm_ext(false);
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      closeModal();
    };

    function openModalAlmoco(id: number, nome: string)  {
      setDeleteId(id);
      setDeleteNome(nome);
      setIsModalOpenAlmoco(true);
    };

    function openModalXis(id: number, nome: string)  {
      setDeleteId(id);
      setDeleteNome(nome);
      setIsModalOpenXis(true);
    };

    function openModalAlm_ext(id: number, nome: string)  {
      setDeleteId(id);
      setDeleteNome(nome);
      setIsModalOpenAlm_ext(true);
    };
  
    function closeModal() {
      setDeleteId(null);
      setDeleteNome('');
      setIsModalOpenAlmoco(false);
      setIsModalOpenXis(false);
      setIsModalOpenAlm_ext(false);
    };
      

    async function carregaDadosAlmoco(){
        setLoadingAlmoco(true);

        const response = await api.get('/almocos');
  
        await api.get('/almocos')
          .then(response => {
            setAlmocos(response.data.almocos);
            setNum_almocos(response.data.num_almocos);
          })
          .catch(error => {
            console.error(error);
           // setErrorMessage('Ocorreu um erro ao listar os funcionários. Contate o Administrador!');
          })
          .finally(() => {
            setLoadingAlmoco(false); // define loading como false após a requisição ter sido concluída (com sucesso ou erro)
          });
    }
    
    async function carregaDadosAlmocoExtra(){
        setLoadingAlm_ext(true);
  
        await api.get('/alm_ext')
          .then(response => {
            setAlmocos_ext(response.data.alm_ext);
            let sum = 0;
            for (const item of response.data.alm_ext) {
                sum += item.quantidade_aext;
            }
            setNumAlmocos_ext(sum);
          })
          .catch(error => {
            console.error(error);
           // setErrorMessage('Ocorreu um erro ao listar os funcionários. Contate o Administrador!');
          })
          .finally(() => {
            setLoadingAlm_ext(false); // define loading como false após a requisição ter sido concluída (com sucesso ou erro)
          });
    }

    async function carregaDadosReservaXis(){
        setLoadingXis(true);
  
        await api.get('/reserva_xis')
          .then(response => {
            setReserva_xis(response.data.reserva_xis);
          })
          .catch(error => {
            console.error(error);
           // setErrorMessage('Ocorreu um erro ao listar os funcionários. Contate o Administrador!');
          })
          .finally(() => {
            setLoadingXis(false); // define loading como false após a requisição ter sido concluída (com sucesso ou erro)
          });
    }
    
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
    }, [ultimaDataEnvio, ultimaDataEnvioXis]);

    useEffect(() => {
        carregaDadosAlmoco(),
        carregaDadosAlmocoExtra(),
        carregaDadosReservaXis()
      }, []);
    
    const emailsAdicionaisLista = obterEmailsAdicionais();
    const destinatariosResumo = emailsAdicionaisLista.length > 0
      ? `${EMAIL_DESTINATARIO_PADRAO} + ${emailsAdicionaisLista.join(', ')}`
      : EMAIL_DESTINATARIO_PADRAO;
    const horarioAlmoco = `${String(HORARIO_ENVIO_AUTOMATICO_HORA).padStart(2, '0')}:${String(HORARIO_ENVIO_AUTOMATICO_MINUTO).padStart(2, '0')}`;
    const horarioXis = `${String(HORARIO_ENVIO_XIS_HORA).padStart(2, '0')}:${String(HORARIO_ENVIO_XIS_MINUTO).padStart(2, '0')}`;
    const ultimaDataEnvioFormatada = ultimaDataEnvio ? moment(ultimaDataEnvio).format('DD/MM/YYYY') : 'nenhum';
    const ultimaDataEnvioXisFormatada = ultimaDataEnvioXis ? moment(ultimaDataEnvioXis).format('DD/MM/YYYY') : 'nenhum';

    return(
        <Container>
          {errorMessage &&
            <TextAlertContainer>   
              <StyledAlert variant="danger">{errorMessage}</StyledAlert>
            </TextAlertContainer>   
          }
          {successMessage && 
            <TextAlertContainer>   
              <StyledAlert variant="success ">{successMessage}</StyledAlert>
            </TextAlertContainer>   
          }
            <RelatoriosContainer>
                <ButtonContainer >
                    <Button onClick={() => handleGerarRelatorioAlmoco()}> Reservar Almoço </Button>    
                    <Button onClick={() => handleGerarRelatorioXis()}> Reserva Xis </Button> 
                </ButtonContainer>
                <DateContainer>
                  <TextDateContainer>
                    <TextDate>Data Inicial</TextDate>
                    <TextDate>Data Final</TextDate>
                  </TextDateContainer>
                    <ButtonDateIntervalContainer>
                      <StyledDatePicker 
                        selected={startDate} 
                        onChange={(dateStart: Date | null) => setStartDate(dateStart)}
                        dateFormat="dd/MM/yyyy"
                        locale="pt-BR"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        withPortal
                      />
                        <BiMoveHorizontal size={30} color={'#0476AC'}/>
                      <StyledDatePicker 
                        selected={endDate} 
                        onChange={(dateEnd: Date | null) => setEndDate(dateEnd)}
                        dateFormat="dd/MM/yyyy"
                        withPortal
                      />
                    </ButtonDateIntervalContainer>
                    <Button onClick={() => handleRelatorioPeriodo()}>Gerar Excel por período</Button>
                </DateContainer>
            </RelatoriosContainer>
            <EmailSettings
              emailMenuOpen={emailMenuOpen}
              onToggleMenu={() => setEmailMenuOpen((open) => !open)}
              emailsAdicionais={emailsAdicionais}
              onChangeEmailsAdicionais={setEmailsAdicionais}
              onSalvarEmailsAdicionais={handleSalvarEmailsAdicionais}
              destinatariosResumo={destinatariosResumo}
              ultimaDataEnvio={ultimaDataEnvio}
              ultimaDataEnvioFormatada={ultimaDataEnvioFormatada}
              ultimaDataEnvioXis={ultimaDataEnvioXis}
              ultimaDataEnvioXisFormatada={ultimaDataEnvioXisFormatada}
              enviandoEmail={enviandoEmail}
              horarioAlmoco={horarioAlmoco}
              horarioXis={horarioXis}
              onEnviarRelatorioAlmoco={() => enviarRelatorioPorEmail(true)}
              onEnviarRelatorioXis={() => enviarRelatorioXisPorEmail(true)}
              emailDestinatarioPadrao={EMAIL_DESTINATARIO_PADRAO}
            />
            <SpinnerContainer>
            {loading &&
              <ColorRing
                visible={true}
                height="60"
                width="60"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
              />  
            }
            </SpinnerContainer>

            <RelatorioTable
              almocosExtra={almocos_ext}
              almocos={almocos}
              reservaXis={reserva_xis}
              loadingAlmocosExtra={loadingAlm_ext}
              loadingAlmoco={loadingAlmoco}
              loadingXis={loadingXis}
              onOpenModalAlmocoExtra={openModalAlm_ext}
              onOpenModalAlmoco={openModalAlmoco}
              onOpenModalXis={openModalXis}
            />
            <ContainerTextFooter>
                <TextDate>QUANTIDADE TOTAL DE ALMOÇOS - {date} = {num_almocos + numAlmocos_ext}<br/><br/><br/></TextDate>
            </ContainerTextFooter>

        <ContainerModal
          isOpen={isModalOpenAlmoco}
          onRequestClose={closeModal}
          contentLabel="Confirmar exclusão"
        >
          <Title>Confirmar exclusão?</Title>
          <SubtitleComp subtitle={`Você está prestes a excluir a reserva de Almoço: \n\n Nome: ${deleteNome} \n\nTem certeza disso?`}/>
            <SpinnerContainer>
              {loadingAlmoco &&         
                  <ColorRing
                    visible={true}
                    height="60"
                    width="60"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                  />  
              }
            </SpinnerContainer>
            <ButonContainer>
              <ButtonGreen onClick={() => handleDeleteAlmoco(deleteId!)}>
                Confirmar
              </ButtonGreen>
            </ButonContainer>
            <ButonContainer>
              <ButtonRed onClick={closeModal}>
                Voltar
              </ButtonRed>
            </ButonContainer>
          </ContainerModal>

          <ContainerModal
            isOpen={isModalOpenXis}
            onRequestClose={closeModal}
            contentLabel="Confirmar exclusão"
          >
          <Title>Confirmar exclusão?</Title>
          <SubtitleComp subtitle={`Você está prestes a excluir a reserva de Xis: \n\n Nome: ${deleteNome} \n\n Tem certeza disso?`}/>
          <SpinnerContainer>
            {loadingXis &&         
                <ColorRing
                  visible={true}
                  height="60"
                  width="60"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                />  
            }
            </SpinnerContainer>
            <ButonContainer>
              <ButtonGreen onClick={() => handleDeleteXis(deleteId!)}>
                Confirmar
              </ButtonGreen>
            </ButonContainer>
            <ButonContainer>
              <ButtonRed onClick={closeModal}>
                Voltar
              </ButtonRed>
            </ButonContainer>
          </ContainerModal>

          <ContainerModal
            isOpen={isModalOpenAlm_ext}
            onRequestClose={closeModal}
            contentLabel="Confirmar exclusão"
          >
          <Title>Confirmar exclusão?</Title>
          <SubtitleComp subtitle={`Você está prestes a excluir a reserva de almoço extra: \n\n Nome: ${deleteNome} \n\n Tem certeza disso?`}/>
          <SpinnerContainer>
            {loadingAlm_ext &&         
                <ColorRing
                  visible={true}
                  height="60"
                  width="60"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                />  
            }
            </SpinnerContainer>
            <ButonContainer>
              <ButtonGreen onClick={() => handleDeleteAlm_ext(deleteId!)}>
                Confirmar
              </ButtonGreen>
            </ButonContainer>
            <ButonContainer>
              <ButtonRed onClick={closeModal}>
                Voltar
              </ButtonRed>
            </ButonContainer>
          </ContainerModal>

        </Container>
        
    )
}