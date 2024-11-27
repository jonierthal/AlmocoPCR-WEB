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
import { Title } from '../../components/Title/styles';
import { SubtitleComp } from '../../components/Subtitle';
import { ColorRing } from  'react-loader-spinner';
import { TitleComp } from '../../components/Title';
import { api } from '../../lib/axios';
import { SpinnerContainer } from '../Relatorios/styles';

export function ManutDepartamentos() {

  type DepartamentoType = {
    id: number;
    nome: string;
  }

  const [departamento, setDepartamentos] = useState<DepartamentoType[]>([]);
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

  // Função para carregar os setores
  async function carregaDadosTabela() {
    setLoading(true);

    try{
        const response = await api.get('/setores');
        const dados = response.data;
        setDepartamentos(dados)
    } catch (error) {
        setErrorMessage("Ocorreu um erro ao listar os departatamentos!")
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    carregaDadosTabela();
  }, []);

  // Função de excluir setor
  async function handleDelete(id: number)  {
    setLoading(true);
    await api.delete(`/setores/${id}`)
      .then(response => {
        carregaDadosTabela();
        setSuccessMessage('Setor excluído com sucesso!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 4000);
      })
      .catch(error => {
        console.error(error);
        setErrorMessage('Ocorreu um erro ao excluir o setor. Contate o Administrador!');
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

  // Função para editar setor
  async function handleEditarCadastro(editNome: string){
    if (editId == null) return;

    setLoading(true);

    await api.put(`/edita_setor/${editId}`, {
      setor: {
        nome: editNome
      }
    })
    .then(() => {
      setSuccessMessage('Setor editado com sucesso!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    })
    .catch ((err) => {
      setErrorMessage('Não foi possível editar o setor, contate o administrador!');
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
      <TextAlertContainer>    
        <ColorRing
          visible={true}
          height="60"
          width="60"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />  
      </TextAlertContainer>    
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
            {departamento.filter((setor) =>
              setor.nome.toLowerCase().startsWith(filterName.toLowerCase()) &&
              (!filterId || setor.id === filterId))
              .map(setor => (
              <tr key={setor.id}>
                <Td>{setor.nome}</Td>
                <Td>
                  <ButtonGreen onClick={() => openEditModal(setor.id, setor.nome)}>
                    <Icon className="fas fa-edit" />
                  </ButtonGreen>
                </Td>
                <Td>
                  <ButtonRed onClick={() => openModal(setor.id, setor.nome)}>
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
        <Title>Confirmar exclusão?</Title>
        <SubtitleComp subtitle={`Você está prestes a excluir o setor: \n\n Nome: ${deleteNome} \n\n  Tem certeza disso?`}/>
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

      {/* Modal Editar Setor */}
      <ContainerModal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Editar Setor"
      >
        <Title>Editar Setor</Title>
        <SubtitleComp subtitle={`Código do Setor: ${editId}`} />
        
        <InputContainer>
          <Input
            value={editNome}
            onChange={(e) => setEditNome(e.target.value)}
            type="text"
            id="editNome"
            placeholder="Nome do Setor"
          />
        </InputContainer>
        {errorMessageInputModal && 
          <TextAlertContainer>   
            <StyledAlert variant="danger">{errorMessageInputModal}</StyledAlert>
          </TextAlertContainer>   
        }
        
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
