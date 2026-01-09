import { Funcionario } from '../../types/funcionario';
import {
  ButtonGreen,
  ButtonRed,
  Icon,
  Table,
  TableContainer,
  Td,
  Th,
  ThMenor,
} from './styles';

type FuncionarioTableProps = {
  funcionarios: Funcionario[];
  filterName: string;
  filterId?: number;
  onEdit: (id: number, nome: string, setorId: number) => void;
  onDelete: (id: number, nome: string) => void;
};

export function FuncionarioTable({
  funcionarios,
  filterName,
  filterId,
  onEdit,
  onDelete,
}: FuncionarioTableProps) {
  const funcionariosFiltrados = funcionarios.filter(
    (funcionario) =>
      funcionario.nome.toLowerCase().startsWith(filterName.toLowerCase()) &&
      (!filterId || funcionario.id_fun === filterId),
  );

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <ThMenor>Código</ThMenor>
            <Th>Nome</Th>
            <Th>Setor</Th>
            <ThMenor>Editar</ThMenor>
            <ThMenor>Excluir</ThMenor>
          </tr>
        </thead>
        <tbody>
          {funcionariosFiltrados.map((funcionario) => (
            <tr key={funcionario.id_fun}>
              <Td>{funcionario.id_fun}</Td>
              <Td>{funcionario.nome}</Td>
              <Td>{funcionario.Setor?.nome}</Td>
              <Td>
                <ButtonGreen
                  onClick={() =>
                    onEdit(funcionario.id_fun, funcionario.nome, funcionario.setor_id)
                  }
                >
                  <Icon className="fas fa-edit" />
                </ButtonGreen>
              </Td>
              <Td>
                <ButtonRed onClick={() => onDelete(funcionario.id_fun, funcionario.nome)}>
                  <Icon className="fas fa-trash-alt" />
                </ButtonRed>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}