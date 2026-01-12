import { useState, useEffect } from 'react';
import { TableContainer, 
         Table, 
         Th, 
         Td, 
         Icon, 
         ThMenor, 
         ButtonGreen, 
         ButtonRed, 
         ContainerModal, 
         ButonContainer, 
         TextAlertContainer, 
         StyledAlert, 
         Input, 
         InputContainer, 
         InputFilterContainer} from './styles';
import { TitleComp} from '@components/Title/styles';
import { LoadingSpinner, Subtitle } from '@components';
import { SpinnerContainer } from '@features/relatorios/pages/Relatorios/styles';
import {
  deleteDepartamento,
  fetchDepartamentos,
  updateDepartamento,
} from '@features/departamentos';

export function ManutDepartamentos() {

  type DepartamentoType = {
    id: number;
    nome: string;
  }

  const [departamentos, setDepartamentos] = useState<DepartamentoType[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteNome, setDeleteNome] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessageInputModal, setErrorMessageInputModal] = useState('');
  const [editNome, setEditNome] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [filterName, setFilterName] = useState('');
  const [filterId, setFilterId] = useState<number>();

  // Função para carregar os departamentos
  async function carregaDadosTabela() {
    setLoading(true);

    try{
        const dados = await fetchDepartamentos();
        setDepartamentos(dados);
    } catch (error) {
        setErrorMessage("Ocorreu um erro ao listar os departamentos!")
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    carregaDadosTabela();
  }, []);

  // Função de excluir departamento
  async function handleDelete(id: number)  {
    setLoading(true);
    await deleteDepartamento(id)
      .then(response => {
        carregaDadosTabela();
        setSuccessMessage('Departamento excluído com sucesso!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 4000);
      })
      .catch(error => {
        console.error(error);
        setErrorMessage('Ocorreu um erro ao excluir o departamento. Contate o Administrador!');
        setTimeout(() => {
          setErrorMessage('');
        }, 4000);
      })
      .finally(() => {
        setLoading(false);
      });
    closeModal();
  };

  // Função para abrir o modal de exclusão
  function openModal(id: number, nome: string)  {
    setDeleteId(id);
    setDeleteNome(nome);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  function closeModal() {
    setDeleteId(null);
    setDeleteNome('');
    setIsModalOpen(false);
  };

  // Função para abrir o modal de edição
  function openEditModal(id: number, nome: string)  {
    setEditId(id);
    setEditNome(nome);
    setIsEditModalOpen(true);
  };

  // Função para fechar o modal de edição
  function closeEditModal(){
    setEditId(null);
    setIsEditModalOpen(false);
  }

  // Função para editar departamento
  async function handleEditarCadastro(editNome: string){
    if (editId == null) return;

    setLoading(true);

    await updateDepartamento(editId, editNome)
    .then(() => {
      setSuccessMessage('Setor editado com sucesso!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    })
    .catch ((err) => {
      setErrorMessage('Não foi possível editar o departamento, contate o administrador!');
      setTimeout(() => {
        setErrorMessage('');
      }, 4000);
    })
    .finally(() => {
      setLoading(false);
      closeEditModal();
      carregaDadosTabela();
    });
  }

  return (
    <>
    <TableContainer>
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
    {loading ? 
      <LoadingSpinner />    
      :   
        <Table>
          <thead>
            <tr>
              <Th>Nome</Th>
              <ThMenor>Editar</ThMenor>
              <ThMenor>Excluir</ThMenor>
            </tr>
          </thead>
          <tbody>
            {departamentos.filter((departamento) =>
              departamento.nome.toLowerCase().startsWith(filterName.toLowerCase()) &&
              (!filterId || departamento.id === filterId))
              .map(departamento => (
              <tr key={departamento.id}>
                <Td>{departamento.nome}</Td>
                <Td>
                  <ButtonGreen onClick={() => openEditModal(departamento.id, departamento.nome)}>
                    <Icon className="fas fa-edit" />
                  </ButtonGreen>
                </Td>
                <Td>
                  <ButtonRed onClick={() => openModal(departamento.id, departamento.nome)}>
                    <Icon className="fas fa-trash-alt" />
                  </ButtonRed>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
    }
    </TableContainer>
    
    <ContainerModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirmar exclusão"
      >
        <TitleComp>Confirmar exclusão?</TitleComp>
        <Subtitle subtitle={`Você está prestes a excluir o departamento: \n\n Nome: ${deleteNome} \n\n  Tem certeza disso?`}/>
          <SpinnerContainer>
            {loading && <LoadingSpinner />}
          </SpinnerContainer> 
        <ButonContainer>
          <ButtonGreen onClick={() => handleDelete(deleteId!)}>
            Confirmar
          </ButtonGreen>
        </ButonContainer>
        <ButonContainer>
          <ButtonRed onClick={closeModal}>
            Voltar
          </ButtonRed>
        </ButonContainer>
      </ContainerModal>

      {/* Modal Editar Departamento */}
      <ContainerModal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Editar Departamento"
      >
        <TitleComp>Editar Departamento</TitleComp>
        <Subtitle subtitle={`Código do Departamento: ${editId}`} />
        
        <InputContainer>
          <Input
            value={editNome}
            onChange={(e) => setEditNome(e.target.value)}
            type="text"
            id="editNome"
            placeholder="Nome do Departamento"
          />
        </InputContainer>
        {errorMessageInputModal && 
          <TextAlertContainer>   
            <StyledAlert variant="danger">{errorMessageInputModal}</StyledAlert>
          </TextAlertContainer>   
        }
        
        <SpinnerContainer>
            {loading && <LoadingSpinner />}
          </SpinnerContainer> 
        <ButonContainer>
          <ButtonGreen onClick={() => handleEditarCadastro(editNome)}>
            Confirmar
          </ButtonGreen>
        </ButonContainer>
        <ButonContainer>
          <ButtonRed onClick={closeEditModal}>
            Voltar
          </ButtonRed>
        </ButonContainer>
      </ContainerModal>
    </>
  );
}
