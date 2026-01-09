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
         InputFilterContainer,
         StyledSelect} from './styles';
import { Title } from '../../components/Title/styles';
import { SubtitleComp } from '../../components/Subtitle';
import { ColorRing } from  'react-loader-spinner'
import { TitleComp } from '../../components/Title';
import { SpinnerContainer } from '../Relatorios/styles';
import { useFuncionarios } from '../../hooks/useFuncionario';
import { useSetores } from '../../hooks/useSetores';


export function ManutFuncionarios() {

  const { setores } = useSetores();
  const {
    funcionarios,
    loading,
    errorMessage,
    successMessage,
    errorMessageInputModal,
    handleDelete,
    handleEditarCadastro,
  } = useFuncionarios();

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteNome, setDeleteNome] = useState<string>('');

  const [editSetorId, setEditSetorId] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const[editId,setEditId] = useState<number>(0);
  const[editNome,setEditNome] = useState<string>('');
  const[chaveEditId,setChaveEditId] = useState<number>(0);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [filterName, setFilterName] = useState('');
  const [filterId, setFilterId] = useState<number>();

  function openModal(id: number, nome: string)  {
    setDeleteId(id);
    setDeleteNome(nome);
    setIsModalOpen(true);
  };

  function closeModal() {
    setDeleteId(null);
    setDeleteNome('');
    setIsModalOpen(false);
  };

  function openEditModal(id: number, nome: string, setorId: number)  {
    setChaveEditId(id);
    setEditNome(nome);
    setEditSetorId(setorId);
    setIsEditModalOpen(true);
  };

  function closeEditModal(){
    setIsEditModalOpen(false)
  }

  useEffect(() => {
    setEditId(chaveEditId)
    }, [chaveEditId]);

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
    <InputFilterContainer>
          <span>
            <input
              type="text"
              id="filterName"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Filtre por nome..."
            />
        </span>
        <span>
          <input
            type="number"
            id="filterId"
            value={filterId}
            onChange={(e) => setFilterId(parseInt(e.target.value))}        
            placeholder="Filtre por código..."
          />
        </span>
        </InputFilterContainer>
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
              <ThMenor>Código</ThMenor>
              <Th>Nome</Th>
              <Th>Setor</Th>
              <ThMenor>Editar</ThMenor>
              <ThMenor>Excluir</ThMenor>
            </tr>
          </thead>
          <tbody>
            {funcionarios.filter((funcionario) =>
              funcionario.nome.toLowerCase().startsWith(filterName.toLowerCase()) &&
              (!filterId || funcionario.id_fun === filterId))
              .map(funcionario => (
              <tr key={funcionario.id_fun}>
                <Td>{funcionario.id_fun}</Td>
                <Td>{funcionario.nome}</Td>
                <Td>{funcionario.Setor?.nome}</Td>
                <Td>
                  <ButtonGreen onClick={() =>openEditModal(funcionario.id_fun, funcionario.nome, funcionario.setor_id)}>
                    <Icon className="fas fa-edit" />
                  </ButtonGreen>
                </Td>
                <Td>
                  <ButtonRed onClick={() => openModal(funcionario.id_fun, funcionario.nome)}>
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
          <SubtitleComp subtitle={`Você está prestes a excluir o funcionário: \n\n Nome: ${deleteNome} \n Código: ${deleteId}\n\n Tem certeza disso?`}/>
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
              <ButtonGreen onClick={() => handleDelete(deleteId!, closeModal)}>
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
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
      >
        <TitleComp title="Editar funcionário" />
        <SubtitleComp subtitle="Preencha as informações"/>
        <form onSubmit={async (event) => {
          event.preventDefault();
          await handleEditarCadastro(
            chaveEditId,
            editId,
            editNome,
            editSetorId,
            closeEditModal,
          );
        }}>
          <InputContainer>
            <Input
              type="number"
              id="codigo"
              defaultValue={chaveEditId}
              onChange={(e) => setEditId(parseInt(e.target.value))}
              required
              onInvalid={(e: React.FormEvent<HTMLInputElement>) => {
                e.currentTarget.setCustomValidity('Por favor, preencha este campo.');
                e.currentTarget.setAttribute('aria-invalid', 'true');
              }}
              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                e.currentTarget.setCustomValidity('');
                e.currentTarget.setAttribute('aria-invalid', 'false');
              }}
            />
            {errorMessageInputModal &&
              <TextAlertContainer>   
                <StyledAlert variant="danger">{errorMessageInputModal}</StyledAlert>
              </TextAlertContainer>   
            }
          </InputContainer>
          <InputContainer>
            <Input
              type="text"
              id="nome"
              value={editNome}
              onChange={(e) => setEditNome(e.target.value)}
              required
              onInvalid={(e: React.FormEvent<HTMLInputElement>) => {
                e.currentTarget.setCustomValidity('Por favor, preencha este campo.');
                e.currentTarget.setAttribute('aria-invalid', 'true');
              }}
              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                e.currentTarget.setCustomValidity('');
                e.currentTarget.setAttribute('aria-invalid', 'false');
              }}
            />
          </InputContainer>
          <InputContainer>
            <StyledSelect
              id="setor"
              value={editSetorId || ''}
              onChange={(e) => setEditSetorId(parseInt(e.target.value))}
              required
            >
              <option value="" disabled={!editSetorId}>Selecione um setor</option>
              {setores.map((setor) => (
                <option key={setor.id} value={setor.id}>
                  {setor.nome}
                </option>
              ))}
            </StyledSelect>
          </InputContainer>

          <ButonContainer>
              <ButtonGreen type="submit">
                Confirmar
              </ButtonGreen>
            </ButonContainer>
            <ButonContainer>
              <ButtonRed onClick={() => closeEditModal()}>
                Voltar
              </ButtonRed>
            </ButonContainer>
        </form>
      </ContainerModal>
      </>
  );
}
