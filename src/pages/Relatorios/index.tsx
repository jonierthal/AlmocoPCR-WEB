import { 
    Container, 
    ButtonContainer, 
    Button, 
    TextDate, 
    DateContainer, 
    TextDateContainer, 
    ButtonDateIntervalContainer,
    RelatoriosContainer,
    AutoEmailContainer,
    AutoEmailStatus,
    AutoEmailText,
    AutoEmailTitle,
    AutoEmailInput,
    ContainerTextFooter,
    SpinnerContainer,
    StyledDatePicker,
    TableSpacing,
    Table,
    TableContainer,
    Th,
    Thead,
    Th2,
    Td,
    ButtonRed,
    Icon
} from "./styles";
import { ButonContainer, ButtonGreen, ContainerModal, StyledAlert, TextAlertContainer } from "../ManutFuncionarios/styles";
import axios from 'axios' ;
import { BiMoveHorizontal } from 'react-icons/bi';
import { useEffect, useState } from "react";
import { ColorRing } from 'react-loader-spinner'
import moment from 'moment';
import * as XLSX from 'xlsx';
import XlsxStyle from 'xlsx-js-style';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from "../../lib/axios";
import { Title } from "../../components/Title/styles";
import { SubtitleComp } from "../../components/Subtitle";

// Registra o locale para Português (Brasil)
registerLocale('pt-BR', ptBR);
// Define o locale padrão como Português (Brasil)
setDefaultLocale('pt-BR');

  const EMAIL_DESTINATARIO_PADRAO = 'jonierthal@gmail.com';
  const HORARIO_ENVIO_AUTOMATICO_HORA = 16;
  const HORARIO_ENVIO_AUTOMATICO_MINUTO = 17;
  const INTERVALO_CHECAGEM_MS = 5000;
  const STORAGE_DATA_ENVIO = 'relatorio-almoco-email-enviado';
  const STORAGE_EMAIL_ADICIONAIS = 'relatorio-almoco-email-adicionais';

  type AlmocoType = {
    cod_funcionario: number,
    "Funcionario.nome": string,
    "Funcionario.Setor.nome": string
    id: number,
    num_almocos: number;
  }

  type AlmocoExtraType = {
    id: number,
    nome_aext: string;
    quantidade_aext: number;
  }

  type ReservaXisType = {
    cod_funcionario: number;
    quantidade_rx: number;
    "Funcionario.nome": string;
    "Funcionario.Setor.nome": string
    id: number;
  }

  type AlmocosPeriodoType = {
    id_fun: number;
    nome: string;
    quantidade: number;
    setor_nome: string;
  }

  type ReservaXisPeriodoType = {
    id_fun: number;
    nome: string;
    quantidade_rx: number;
    setor_nome: string;
  }

  type RelatorioEmailPayload = {
    destinatarioPadrao: string;
    destinatariosAdicionais: string;
    dataReferencia: string;
  }

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
    const [emailsAdicionais, setEmailsAdicionais] = useState<string>('')

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
      const emailsSalvos = localStorage.getItem(STORAGE_EMAIL_ADICIONAIS);

      if (dataSalva) {
        setUltimaDataEnvio(dataSalva);
      }

      if (emailsSalvos) {
        setEmailsAdicionais(emailsSalvos);
      }
    }, []);

    //estilos para o cabeçalho da planilha
    const tableHeader = {
      fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: { rgb: 'FFFF00' }
      },
      font: {
        bold: true,
      },
      alignment: {
        vertical: "center",
        horizontal: "center"
      },
      border: {
        bottom: { style: "thin" },
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      },
      numFmt: "0" // Formatação para número
    };

    const tableHeaderTitles = {
      fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: { rgb: '00B0F0' }
      },
      font: {
        bold: true,
      },
      alignment: {
        vertical: "center",
        horizontal: "center"
      },
      border: {
        bottom: { style: "thin" },
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      }
    };

    // Definir o estilo de borda fina para todas as outras células
    const thinBorder = {
      border: {
        bottom: { style: "thin" },
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      },
      alignment: {
        vertical: "center",
        horizontal: "center",
      },
      numFmt: "0" // Formatação para números
    };
    
    const dateStyle = {
      ...thinBorder,
      numFmt: "dd/mm/yyyy" // Formatação para datas
    };

    let date = moment().format('DD/MM/YYYY');

    function atualizarDataEnvio(dataEnvio: string) {
      setUltimaDataEnvio(dataEnvio);
      localStorage.setItem(STORAGE_DATA_ENVIO, dataEnvio);
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

            const almocosPeriodo = dataAlmocosPeriodo.map(almocoPeriodo => [almocoPeriodo.nome, almocoPeriodo.setor_nome || '', almocoPeriodo.quantidade]);           
            const almocosExtrasPeriodo = dataAlmocosExtrasPeriodo.map(almocoExtrasPeriodo => ['',almocoExtrasPeriodo.nome_aext, almocoExtrasPeriodo.quantidade_aext]);
            const reservaXisPeriodo = dataReservaXisPeriodo.map(reservaXisPeriodo => ['',reservaXisPeriodo.nome,reservaXisPeriodo.setor_nome || '', reservaXisPeriodo.quantidade_rx]);

            const maxLength = Math.max(almocosPeriodo.length, almocosExtrasPeriodo.length, reservaXisPeriodo.length);
      
            const dados = [];
            for (let i = 0; i < maxLength; i++) {
              const almocoRow = almocosPeriodo[i] || ['', ''];
              const almocoExtrasRow = almocosExtrasPeriodo[i] || ['', '', ''];
              const reservaXisRow = reservaXisPeriodo[i] || ['', '', ''];

              dados.push([...almocoRow, ...almocoExtrasRow, ...reservaXisRow]);
            }

            const planilha = XLSX.utils.aoa_to_sheet([
              ['DATA INICIO', 'DATA FIM'],
              [startDate,endDate],
              [null],
              ['NOME', 'DEPARTAMENTO', 'QUANTIDADE', '', 'NOME ALMOCO EXTRA','QUANTIDADE', '','NOME RESERVA XIS','DEPARTAMENTO','QUANTIDADE','','TOTAL'],
              ...dados
            ]);

            planilha['L5'] = { v: total, t: 'n' };

            //seta o estilho nas celular indicadas
            planilha['A1'].s = tableHeader;
            planilha['B1'].s = tableHeader;
            planilha['A4'].s = tableHeader;
            planilha['B4'].s = tableHeader;
            planilha['C4'].s = tableHeader;

            planilha['E4'].s = tableHeader;
            planilha['F4'].s = tableHeader;

            planilha['H4'].s = tableHeader;
            planilha['I4'].s = tableHeader;
            planilha['J4'].s = tableHeader;

            planilha['L4'].s = tableHeader;
            planilha['A2'].s = dateStyle;
            planilha['B2'].s = dateStyle;

            planilha['L5'].s = thinBorder;

            for (let i = 5; i <= almocosPeriodo.length + 4; i++) {
              const cellRef = `A${i}`;
              planilha[cellRef].s = thinBorder;
            }
      
            for (let i = 5; i <= almocosPeriodo.length + 4; i++) {
              const cellRef = `B${i}`;
              planilha[cellRef].s = thinBorder;
            }

            for (let i = 5; i <= almocosPeriodo.length + 4; i++) {
              const cellRef = `C${i}`;
              planilha[cellRef].s = thinBorder;
            }

            for (let i = 5; i <= almocosExtrasPeriodo.length + 4; i++) {
              const cellRef = `E${i}`;
              planilha[cellRef].s = thinBorder;
            }

            for (let i = 5; i <= almocosExtrasPeriodo.length + 4; i++) {
              const cellRef = `F${i}`;
              planilha[cellRef].s = thinBorder;
            }

            for (let i = 5; i <= reservaXisPeriodo.length + 4; i++) {
              const cellRef = `H${i}`;
              planilha[cellRef].s = thinBorder;
            }

            for (let i = 5; i <= reservaXisPeriodo.length + 4; i++) {
              const cellRef = `I${i}`;
              planilha[cellRef].s = thinBorder;
            }

            for (let i = 5; i <= reservaXisPeriodo.length + 4; i++) {
              const cellRef = `J${i}`;
              planilha[cellRef].s = thinBorder;
            }
            
            planilha['!cols'] = [{ width: 40 },{ width: 30},{ width: 15 },{ width: 5},{ width: 40},{ width: 15 },{ width: 5},{ width: 40},{ width: 30},{ width: 15 },{width: 5},{ width: 15}];

            const livro = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(livro, planilha, 'Relatório período');
            XlsxStyle.writeFile(livro, 'relatorio-periodo.xlsx');

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

        const reservas = reserva_xis.map(reserva => [reserva['Funcionario.nome'],reserva['Funcionario.Setor.nome'] || '',reserva.quantidade_rx,]);
        
        //cria a planilha
        const planilha = XLSX.utils.aoa_to_sheet([
          ['Funcionário','Departamento','Quantidade',],
          ...reservas
        ]);
        
        //seta o estilho nas celular indicadas
        planilha['A1'].s = tableHeader;
        planilha['B1'].s = tableHeader;
        planilha['C1'].s = tableHeader;

        for (let i = 2; i <= reservas.length + 1; i++) {
          const cellRef = `A${i}`;
          planilha[cellRef].s = thinBorder;
        }

        for (let i = 2; i <= reservas.length + 1; i++) {
          const cellRef = `B${i}`;
          planilha[cellRef].s = thinBorder;
        }

        for (let i = 2; i <= reservas.length + 1; i++) {
          const cellRef = `C${i}`;
          planilha[cellRef].s = thinBorder;
        }

        //Define a largura da celula
        planilha['!cols'] = [{ width: 40 },{ width: 15},{ width: 15 } ];

        //responsavel pelo download da planoilha 
        const livro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(livro, planilha, 'Reservas de Xis');
      
        XlsxStyle.writeFile(livro, 'relatorio-xis.xlsx');
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false)
      }

    }

    function handleGerarRelatorioAlmoco() {

    try{    
      setLoading(true)

      const reservas = almocos.map(almoco => [
        almoco.cod_funcionario,
        almoco['Funcionario.nome'],
        almoco['Funcionario.Setor.nome'] || '' ])

      const extras = almocos_ext.map(extra => [
        '','',
        extra.nome_aext,
        extra.quantidade_aext
      ])

      const dados = reservas.map((reserva, index) => [
        ...reserva,
        ...(extras[index] || ['', '']) // adiciona as células dos extras para a reserva atual, ou células vazias se não houver extras para a reserva
      ])

        const planilha = XLSX.utils.aoa_to_sheet([
          ['RESERVAS DE ALMOÇO','','','', '','RESERVAS EXTRAS','','','','TOTAL RESERVAS+EXTRAS'],
          ['Código','Funcionário','Departamento','TOTAL','','Nome Almoço Extra', 'Quantidade','TOTAL',],
          ...dados
        ]);

        // Define o valor de num_almocos na célula D3
        planilha['D3'] = { v: num_almocos, t: 'n' };

        // Define o valor de num_almocos+=_ext na célula G3
        planilha['H3'] = { v: numAlmocos_ext, t: 'n' };

        // Define o valor de num_almocos+numAlmoco_ext na célula G3
        planilha['J2'] = { v: (numAlmocos_ext+num_almocos), t: 'n' };

        // Define a mesclagem das células
        planilha['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // mesclagem A1:C1
          { s: { r: 0, c: 5 }, e: { r: 0, c: 7 } }, // mesclagem E1:G1
        ];
  
        // seta o estilo nas celulas indicadas
        planilha['A1'].s = tableHeaderTitles;
        planilha['F1'].s = tableHeaderTitles;

        planilha['A2'].s = tableHeader;
        planilha['B2'].s = tableHeader;
        planilha['C2'].s = tableHeader;
        planilha['D2'].s = tableHeader;
        
        planilha['F2'].s = tableHeader;
        planilha['G2'].s = tableHeader;
        planilha['H2'].s = tableHeader;

        planilha['J1'].s = tableHeader;

        // Define o estilo de borda fina para todas as outras celulas
        const thinBorder = {
          border: {
            bottom: { style: "thin" },
            top: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          },
          alignment: {
            vertical: "center",
            horizontal: "center",
          }
        }
  
        for (let i = 3; i <= reservas.length + 2; i++) {
          const cellRef = `A${i}`;
          planilha[cellRef].s = thinBorder;
        }

        for (let i = 3; i <= reservas.length + 2; i++) {
          const cellRef = `B${i}`;
          planilha[cellRef].s = thinBorder;
        }

        for (let i = 3; i <= reservas.length + 2; i++) {
          const cellRef = `C${i}`;
          planilha[cellRef].s = thinBorder;
        }

         for (let i = 3; i <= extras.length + 2; i++) {
          const cellRef = `F${i}`;
          planilha[cellRef].s = thinBorder;
        }

        for (let i = 3; i <= extras.length + 2; i++) {
          const cellRef = `G${i}`;
          planilha[cellRef].s = thinBorder;
        }

        planilha['D3'].s = thinBorder;
        planilha['H3'].s = thinBorder; 
        planilha['J2'].s = thinBorder; 
  
        // Define a largura da celula
        planilha['!cols'] = [{ width: 15 },{ width: 40},{ width: 30},{width:15}, {width:5},{width:40},{width:15},{width:15},{width:5},{width:30}];
  
        // responsavel pelo download da planilha 
        const livro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(livro, planilha, 'Reservas de Almoço');
  
        XlsxStyle.writeFile(livro, 'relatorio-almoco.xlsx');
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
      }, INTERVALO_CHECAGEM_MS);

      return () => clearInterval(intervalo);
    }, [ultimaDataEnvio]);

    useEffect(() => {
        carregaDadosAlmoco(),
        carregaDadosAlmocoExtra(),
        carregaDadosReservaXis()
      }, []);
    
    const emailsAdicionaisLista = obterEmailsAdicionais();
    const destinatariosResumo = emailsAdicionaisLista.length > 0
      ? `${EMAIL_DESTINATARIO_PADRAO} + ${emailsAdicionaisLista.join(', ')}`
      : EMAIL_DESTINATARIO_PADRAO;

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
            <AutoEmailContainer>
              <AutoEmailTitle>Envio automático diário às 08:10</AutoEmailTitle>
              <AutoEmailText>
                O relatório diário é enviado automaticamente para o destinatário padrão (rh@pcr.ind.br) e demais adicionais informados.
              </AutoEmailText>
              <AutoEmailText>
                Destinatários adicionais (separe por vírgula ou ponto e vírgula)
              </AutoEmailText>
              <AutoEmailInput
                rows={3}
                value={emailsAdicionais}
                onChange={(event) => setEmailsAdicionais(event.target.value)}
                placeholder="email1@exemplo.com; email2@exemplo.com"
              />
              <Button type="button" onClick={handleSalvarEmailsAdicionais}>
                Salvar destinatários adicionais
              </Button>
              <AutoEmailText>
                Serão enviados para: {destinatariosResumo}
              </AutoEmailText>

              <AutoEmailStatus>
                {ultimaDataEnvio ? `Último envio registrado: ${moment(ultimaDataEnvio).format('DD/MM/YYYY')}` : 'Nenhum envio registrado ainda.'}
              </AutoEmailStatus>
              <Button disabled={enviandoEmail} onClick={() => enviarRelatorioPorEmail(true)}>
                {enviandoEmail ? 'Enviando...' : 'Enviar e-mail de teste agora'}
              </Button>
            </AutoEmailContainer>
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

            <TableContainer> 
              <TableSpacing>       
                  <Table>
                    <Thead>
                        <tr>
                          <Th colSpan={3}>Almoços extras</Th>
                        </tr>
                        <tr>
                          <Th2 >Nome</Th2>
                          <Th2 >Quantidade</Th2>
                          <Th2>Excluir</Th2>
                      </tr>
                    </Thead>

                    <tbody>
                          {almocos_ext.map(almoco_ext => (
                              <tr key={almoco_ext.id}>
                                  <Td>{almoco_ext.nome_aext}</Td>
                                  <Td>{almoco_ext.quantidade_aext}</Td>
                                  <Td>
                                    <ButtonRed onClick={() => openModalAlm_ext(almoco_ext.id,almoco_ext.nome_aext)}>
                                      <Icon className="fas fa-trash-alt" />
                                    </ButtonRed>
                                  </Td>
                              </tr>
                          ))}
                      </tbody>   
                  </Table>
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
              </TableSpacing>

              <TableSpacing>             
                <Table>
                  <Thead>
                      <tr>
                        <Th colSpan={3}>Lista de almoços</Th>
                      </tr>
                      <tr>
                        <Th2 >Nome</Th2>
                        <Th2 >Departamento</Th2>
                        <Th2>Excluir</Th2>
                    </tr>
                  </Thead>
                  
                  <tbody>
                    {almocos.map(almoco => (
                      <tr key={almoco.cod_funcionario}>
                        <Td>{almoco['Funcionario.nome']}</Td>
                        <Td>{almoco['Funcionario.Setor.nome']}</Td>
                        <Td>
                          <ButtonRed onClick={() => openModalAlmoco(almoco.id,almoco['Funcionario.nome'])}>
                            <Icon className="fas fa-trash-alt" />
                          </ButtonRed>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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
              </TableSpacing>

              <TableSpacing>    
                <Table>
                  <Thead>
                      <tr>
                        <Th colSpan={3}>Reservas de Xis</Th>
                      </tr>
                      <tr>
                        <Th2 >Nome</Th2>
                        <Th2 >Departamento</Th2>
                        <Th2>Excluir</Th2>
                    </tr>
                  </Thead>
                    
                  <tbody>
                    {reserva_xis.map(xis => (
                    <tr key={xis.cod_funcionario}>
                      <Td>{xis['Funcionario.nome']}</Td>
                      <Td>{xis['Funcionario.Setor.nome']}</Td>
                      <Td>
                        <ButtonRed onClick={() => openModalXis(xis.id,xis['Funcionario.nome'])}>
                          <Icon className="fas fa-trash-alt" />
                        </ButtonRed>
                      </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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
              </TableSpacing>
            </TableContainer>
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