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
import { ColorRing } from  'react-loader-spinner'
import { TitleComp } from '../../components/Title';
import { api } from '../../lib/axios';
import { SpinnerContainer } from '../Relatorios/styles';


export function ManutFuncionarios() {

  type FuncionarioType = {
    id_fun: number;
    nome: string;
  }

  const [funcionarios, setFuncionarios] = useState<FuncionarioType[]>([]);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteNome, setDeleteNome] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const[errorMessageInputModal, setErrorMessageInputModal] = useState('')

  const[editId,setEditId] = useState<number>(0);
  const[editNome,setEditNome] = useState<string>('');
  const[chaveEditId,setChaveEditId] = useState<number>(0);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [filterName, setFilterName] = useState('');
  const [filterId, setFilterId] = useState<number>();


  async function carregaDadosTabela(){
      setLoading(true);

      await api.get('/cad_fun_id')
        .then(response => {
          setFuncionarios(response.data.pesquisaFuncionario);
        })
        .catch(error => {
          console.error(error);
          setErrorMessage('Ocorreu um erro ao listar os funcionários. Contate o Administrador!');
        })
        .finally(() => {
          setLoading(false); // define loading como false após a requisição ter sido concluída (com sucesso ou erro)
        });
  }

  useEffect(() => {
    carregaDadosTabela()
    }, []);

  async function handleDelete(id: number)  {
    setLoading(true);

    await api.delete(`/cadastro/${id}`)
      .then(response => {
        carregaDadosTabela();
        setSuccessMessage('Funcionário excluído com sucesso!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 4000);
      })
      .catch(error => {
        console.error(error);
        setErrorMessage('Ocorreu um erro ao excluir o funcionário. Contate o Administrador!');
        setTimeout(() => {
          setErrorMessage('');
        }, 4000);
      })
      .finally(() => {
        setLoading(false);
      });
    closeModal();
  };

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

  function openEditModal(id: number, nome: string)  {
    setChaveEditId(id)
    setEditNome(nome)
    setIsEditModalOpen(true);
  };

  function closeEditModal(){
    setIsEditModalOpen(false)
  }

  useEffect(() => {
    setEditId(chaveEditId)
    }, [chaveEditId]);

  async function handleEditarCadastro(id: number, editId: number, editNome: string){

    switch(true) {
      case editId > 0:
        await api.get(`/verificar-id/${editId}`)
          .then(async response => {

          if((response.data.idExiste && id === editId) || (!response.data.idExiste)) {

            setLoading(true);

            await api.put(`/edita_cadastro/${id}`, {
              funcionario: {
              id: editId,
              nome: editNome
            }
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(() => {
              setSuccessMessage('Funcionário editado com sucesso!');
              setTimeout(() => {
              setSuccessMessage('');
            }, 4000);
            })
            .catch ((err) => {
              setErrorMessage('Não foi possível editar o funcionário, contate o adminsitrador!')
              setTimeout(() => {
              setErrorMessage('');
              }, 4000);
            })
            .finally(() => {
              setLoading(false);
              closeEditModal();
              carregaDadosTabela();
          });

          } else if (response.data.idExiste && id !== editId){
            closeEditModal();
            setErrorMessage('Não foi possível alterar este funcionário, pois este código já existe! Digite um código válido!')
              setTimeout(() => {
                setErrorMessage('');
              }, 6000);
          }
        })
        .catch(error => {
          console.error("Verificar Id Error: ",error);
        })

      case editId === 0:
        setErrorMessageInputModal('Id inválido! Este valor não pode ser 0!');
        setTimeout(() => {
          setErrorMessageInputModal('');
        }, 4000);
        break;

      case editId <= 0:
        setErrorMessageInputModal('Id inválido! Este valor não pode ser negativo!');
        setTimeout(() => {
          setErrorMessageInputModal('');
        }, 4000);
        break;
    }
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
                <Td>
                  <ButtonGreen onClick={() =>openEditModal(funcionario.id_fun, funcionario.nome)}>
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
      <ContainerModal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
      >
        <TitleComp title="Editar funcionário" />
        <SubtitleComp subtitle="Preencha as informações"/>
        <form onSubmit={async (event) => {
          event.preventDefault();
          await handleEditarCadastro(chaveEditId, editId, editNome);
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
