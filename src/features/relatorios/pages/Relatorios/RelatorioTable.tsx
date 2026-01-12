import { LoadingSpinner } from '@components';
import {
  ButtonRed,
  Icon,
  SpinnerContainer,
  Table,
  TableContainer,
  TableSpacing,
  Td,
  Th,
  Th2,
  Thead,
} from './styles';
import { AlmocoExtraType, AlmocoType, ReservaXisType } from './types';

type RelatorioTableProps = {
  almocosExtra: AlmocoExtraType[];
  almocos: AlmocoType[];
  reservaXis: ReservaXisType[];
  loadingAlmocosExtra: boolean;
  loadingAlmoco: boolean;
  loadingXis: boolean;
  onOpenModalAlmocoExtra: (id: number, nome: string) => void;
  onOpenModalAlmoco: (id: number, nome: string) => void;
  onOpenModalXis: (id: number, nome: string) => void;
};

export function RelatorioTable({
  almocosExtra,
  almocos,
  reservaXis,
  loadingAlmocosExtra,
  loadingAlmoco,
  loadingXis,
  onOpenModalAlmocoExtra,
  onOpenModalAlmoco,
  onOpenModalXis,
}: RelatorioTableProps) {
  return (
    <TableContainer>
      <TableSpacing>
        <Table>
          <Thead>
            <tr>
              <Th colSpan={3}>Almoços extras</Th>
            </tr>
            <tr>
              <Th2>Nome</Th2>
              <Th2>Quantidade</Th2>
              <Th2>Excluir</Th2>
            </tr>
          </Thead>

          <tbody>
            {almocosExtra.map((almocoExtra) => (
              <tr key={almocoExtra.id}>
                <Td>{almocoExtra.nome_aext}</Td>
                <Td>{almocoExtra.quantidade_aext}</Td>
                <Td>
                  <ButtonRed
                    onClick={() =>
                      onOpenModalAlmocoExtra(almocoExtra.id, almocoExtra.nome_aext)
                    }
                  >
                    <Icon className="fas fa-trash-alt" />
                  </ButtonRed>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <SpinnerContainer>
          {loadingAlmocosExtra && <LoadingSpinner />}
        </SpinnerContainer>
      </TableSpacing>

      <TableSpacing>
        <Table>
          <Thead>
            <tr>
              <Th colSpan={3}>Lista de almoços</Th>
            </tr>
            <tr>
              <Th2>Nome</Th2>
              <Th2>Departamento</Th2>
              <Th2>Excluir</Th2>
            </tr>
          </Thead>

          <tbody>
            {almocos.map((almoco) => (
              <tr key={almoco.cod_funcionario}>
                <Td>{almoco['Funcionario.nome']}</Td>
                <Td>{almoco['Funcionario.Setor.nome']}</Td>
                <Td>
                  <ButtonRed
                    onClick={() => onOpenModalAlmoco(almoco.id, almoco['Funcionario.nome'])}
                  >
                    <Icon className="fas fa-trash-alt" />
                  </ButtonRed>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <SpinnerContainer>
          {loadingAlmoco && <LoadingSpinner />}
        </SpinnerContainer>
      </TableSpacing>

      <TableSpacing>
        <Table>
          <Thead>
            <tr>
              <Th colSpan={3}>Reservas de Xis</Th>
            </tr>
            <tr>
              <Th2>Nome</Th2>
              <Th2>Departamento</Th2>
              <Th2>Excluir</Th2>
            </tr>
          </Thead>

          <tbody>
            {reservaXis.map((xis) => (
              <tr key={xis.cod_funcionario}>
                <Td>{xis['Funcionario.nome']}</Td>
                <Td>{xis['Funcionario.Setor.nome']}</Td>
                <Td>
                  <ButtonRed
                    onClick={() => onOpenModalXis(xis.id, xis['Funcionario.nome'])}
                  >
                    <Icon className="fas fa-trash-alt" />
                  </ButtonRed>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <SpinnerContainer>
          {loadingXis && <LoadingSpinner />}
        </SpinnerContainer>
      </TableSpacing>
    </TableContainer>
  );
}