import { 
    Container, 
    ButtonContainer, 
    Button, 
    TextDate, 
    DateContainer, 
    TextDateContainer, 
    ButtonDateIntervalContainer,
    RelatoriosContainer,
    ListsContainer,
    ListaAlmocosContainer,
    ListaExtrasContainer,
    ListaXisContainer,
    ListGroupItem,
    ContainerTextFooter,
    ListGroupItemText,
    SpinnerContainer,
    StyledDatePicker
} from "./styles";
import { BiMoveHorizontal } from 'react-icons/bi';
import ListGroup from 'react-bootstrap/ListGroup';
import { useEffect, useState } from "react";
import axios from "axios";
import { ProgressBar } from 'react-loader-spinner'
import moment from 'moment';
import * as XLSX from 'xlsx';
import XlsxStyle from 'xlsx-js-style';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from "../../lib/axios";

// Registra o locale para Português (Brasil)
registerLocale('pt-BR', ptBR);
// Define o locale padrão como Português (Brasil)
setDefaultLocale('pt-BR');

  type AlmocoType = {
    cod_funcionario: number,
    "Funcionario.nome": string;
    num_almocos: number;
  }

  type AlmocoExtraType = {
    nome_aext: string;
    quantidade_aext: number;
  }

  type ReservaXisType = {
    cod_funcionario: number;
    quantidade_rx: number;
    "Funcionario.nome": string;
  }

  type AlmocosPeriodoType = {
    id_fun: number;
    nome: string;
    quantidade: number;
  }

  export function Relatorios(){
    const [loading, setLoading] = useState<boolean>(false)
    const [almocos, setAlmocos] = useState<AlmocoType[]>([])
    const [num_almocos, setNum_almocos] = useState<number>(0)
    const [almocos_ext, setAlmocos_ext] = useState<AlmocoExtraType[]>([])
    const [numAlmocos_ext, setNumAlmocos_ext] = useState<number>(0)
    const [reserva_xis, setReserva_xis] = useState<ReservaXisType[]>([])

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

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

    function handleRelatorioPeriodo() {
      if (startDate && endDate) {
        // Converte as datas para o formato desejado (se necessário)
        const startDateString = startDate.toISOString();
        const endDateString = endDate.toISOString();
    
        // Aqui você pode chamar a API para buscar os dados com as datas selecionadas
        axios.get('https://appalmoco-pcr.azurewebsites.net//retorno_rel', {
          params: {
            startDate: startDateString,
            endDate: endDateString
          }
        })
          .then((response) => {
            setLoading(true);

            const dataAlmocosPeriodo: AlmocosPeriodoType[] = response.data.funcionarios;
            const dataAlmocosExtrasPeriodo: AlmocoExtraType[] = response.data.almExts;
            const total = response.data.total.quantidade_total;

            console.log(dataAlmocosExtrasPeriodo)

            const almocosPeriodo = dataAlmocosPeriodo.map(almocoPeriodo => [almocoPeriodo.nome, almocoPeriodo.quantidade]);           
            const almocosExtrasPeriodo = dataAlmocosExtrasPeriodo.map(almocoExtrasPeriodo => ['',almocoExtrasPeriodo.nome_aext, almocoExtrasPeriodo.quantidade_aext]);
      
            const dados = almocosPeriodo.map((almocosPeriodo, index) => [
              ...almocosPeriodo,
              ...(almocosExtrasPeriodo[index] || ['', '']) // adiciona as células dos extras para a reserva atual, ou células vazias se não houver extras para a reserva
            ])

            const planilha = XLSX.utils.aoa_to_sheet([
              ['DATA INICIO', 'DATA FIM'],
              [startDate,endDate],
              [null],
              ['NOME', 'QUANTIDADE', '', 'NOME ALMOCO EXTRA','QUANTIDADE', '', 'TOTAL'],
              ...dados
            ]);

            planilha['G5'] = { v: total, t: 'n' };

            //seta o estilho nas celular indicadas
            planilha['A1'].s = tableHeader;
            planilha['B1'].s = tableHeader;
            planilha['A4'].s = tableHeader;
            planilha['B4'].s = tableHeader;
            planilha['D4'].s = tableHeader;
            planilha['E4'].s = tableHeader;
            planilha['G4'].s = tableHeader;
            planilha['A2'].s = dateStyle;
            planilha['B2'].s = dateStyle;

            planilha['G5'].s = thinBorder;

            for (let i = 5; i <= almocosPeriodo.length + 4; i++) {
              const cellRef = `A${i}`;
              planilha[cellRef].s = thinBorder;
            }
      
            for (let i = 5; i <= almocosPeriodo.length + 4; i++) {
              const cellRef = `B${i}`;
              planilha[cellRef].s = thinBorder;
            }

            for (let i = 5; i <= almocosExtrasPeriodo.length + 4; i++) {
              const cellRef = `D${i}`;
              planilha[cellRef].s = thinBorder;
            }

            for (let i = 5; i <= almocosExtrasPeriodo.length + 4; i++) {
              const cellRef = `E${i}`;
              planilha[cellRef].s = thinBorder;
            }
            
            planilha['!cols'] = [{ width: 40 },{ width: 15},{ width: 5 },{ width: 40},{ width: 15},{ width: 5 },{ width: 15}];

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

        const reservas = reserva_xis.map(reserva => [reserva['Funcionario.nome'], reserva.quantidade_rx]);
        
        //cria a planilha
        const planilha = XLSX.utils.aoa_to_sheet([
          ['Funcionário', 'Quantidade'],
          ...reservas
        ]);
        
        //seta o estilho nas celular indicadas
        planilha['A1'].s = tableHeader;
        planilha['B1'].s = tableHeader;

        for (let i = 2; i <= reservas.length + 1; i++) {
          const cellRef = `A${i}`;
          planilha[cellRef].s = thinBorder;
        }

        for (let i = 2; i <= reservas.length + 1; i++) {
          const cellRef = `B${i}`;
          planilha[cellRef].s = thinBorder;
        }

        //Define a largura da celula
        planilha['!cols'] = [{ width: 40 },{ width: 15} ];

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
        almoco['Funcionario.nome']
      ])

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
          ['RESERVAS DE ALMOÇO', '','', '','RESERVAS EXTRAS','','','','TOTAL RESERVAS+EXTRAS'],
          ['Código','Funcionário','TOTAL','','Nome Almoco Extra', 'Quantidade','TOTAL'],
          ...dados
        ]);

        // Define o valor de num_almocos na célula C3
        planilha['C3'] = { v: num_almocos, t: 'n' };

        // Define o valor de num_almocos+=_ext na célula G3
        planilha['G3'] = { v: numAlmocos_ext, t: 'n' };

        // Define o valor de num_almocos+numAlmoco_ext na célula G3
        planilha['I2'] = { v: (numAlmocos_ext+num_almocos), t: 'n' };

        // Define a mesclagem das células
        planilha['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // mesclagem A1:C1
          { s: { r: 0, c: 4 }, e: { r: 0, c: 6 } }, // mesclagem E1:G1
        ];
  
        // seta o estilo nas celulas indicadas
        planilha['A1'].s = tableHeaderTitles;
        planilha['E1'].s = tableHeaderTitles;

        planilha['A2'].s = tableHeader;
        planilha['B2'].s = tableHeader;
        planilha['C2'].s = tableHeader;
        planilha['E2'].s = tableHeader;
        planilha['F2'].s = tableHeader;
        planilha['G2'].s = tableHeader;
        planilha['I1'].s = tableHeader;

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

         for (let i = 3; i <= extras.length + 2; i++) {
          const cellRef = `E${i}`;
          planilha[cellRef].s = thinBorder;
        }

        for (let i = 3; i <= extras.length + 2; i++) {
          const cellRef = `F${i}`;
          planilha[cellRef].s = thinBorder;
        }

        planilha['C3'].s = thinBorder;
        planilha['G3'].s = thinBorder; 
        planilha['I2'].s = thinBorder; 
  
        // Define a largura da celula
        planilha['!cols'] = [{ width: 15 },{ width: 40},{ width: 15},{width:5}, {width:30},{width:15},{width:15},{width:5},{width:30}];
  
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
      

    async function carregaDadosAlmoco(){
        setLoading(true);
  
        await api.get('/almocos')
          .then(response => {
            setAlmocos(response.data.almocos);
            setNum_almocos(response.data.num_almocos);
            console.log(response.data.almocos)
            console.log(response.data.num_almocos)
          })
          .catch(error => {
            console.error(error);
           // setErrorMessage('Ocorreu um erro ao listar os funcionários. Contate o Administrador!');
          })
          .finally(() => {
            setLoading(false); // define loading como false após a requisição ter sido concluída (com sucesso ou erro)
          });
    }
    
    async function carregaDadosAlmocoExtra(){
        setLoading(true);
  
        await api.get('/alm_ext')
          .then(response => {
            setAlmocos_ext(response.data.alm_ext);
            console.log(response.data.alm_ext)
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
            setLoading(false); // define loading como false após a requisição ter sido concluída (com sucesso ou erro)
          });
    }

    async function carregaDadosReservaXis(){
        setLoading(true);
  
        await api.get('/reserva_xis')
          .then(response => {
            setReserva_xis(response.data.reserva_xis);
            console.log(response.data.reserva_xis)
          })
          .catch(error => {
            console.error(error);
           // setErrorMessage('Ocorreu um erro ao listar os funcionários. Contate o Administrador!');
          })
          .finally(() => {
            setLoading(false); // define loading como false após a requisição ter sido concluída (com sucesso ou erro)
          });
    }
  
    useEffect(() => {
        carregaDadosAlmoco(),
        carregaDadosAlmocoExtra(),
        carregaDadosReservaXis()
      }, []);
      
    return(
        <Container>
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
            <SpinnerContainer>
            {loading &&         
                <ProgressBar
                    height="80"
                    width="80"
                    ariaLabel="progress-bar-loading"
                    wrapperStyle={{}}
                    wrapperClass="progress-bar-wrapper"
                    borderColor = '#0476AC'
                    barColor = '#0476AC'
                />   
            }
            </SpinnerContainer>
            <ListsContainer>
                <ListaExtrasContainer>
                    <ListGroup className="text-center">
                        <ListGroupItem active>Almoços extras</ListGroupItem>
                        {almocos_ext.map(almoco_ext => (
                            <ListGroupItemText key={almoco_ext.quantidade_aext}>{almoco_ext.nome_aext} - {almoco_ext.quantidade_aext}</ListGroupItemText>
                        ))}
                    </ListGroup >
                </ListaExtrasContainer>
                <ListaAlmocosContainer>
                    <ListGroup className="text-center" >
                        <ListGroupItem active>Lista de almoços</ListGroupItem>  
                        {almocos.map(almoco => (  
                            <ListGroupItemText key={almoco.cod_funcionario}>{almoco['Funcionario.nome']}</ListGroupItemText>
                        ))}
                    </ListGroup>
                </ListaAlmocosContainer>
                <ListaXisContainer>
                    <ListGroup className="text-center">
                        <ListGroupItem active>Reserva de Xis</ListGroupItem>
                        {reserva_xis.map(xis => (
                            <ListGroupItemText key={xis.cod_funcionario}>{xis['Funcionario.nome']}</ListGroupItemText>
                        ))}
                    </ListGroup>
                </ListaXisContainer>
            </ListsContainer>

            <ContainerTextFooter>
                <TextDate>QUANTIDADE TOTAL DE ALMOÇOS - {date} = {num_almocos + numAlmocos_ext}</TextDate>
            </ContainerTextFooter>
            
           
        </Container>
    )
}