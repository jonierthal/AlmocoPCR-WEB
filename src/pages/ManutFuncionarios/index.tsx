import { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../components/Feedback/LoadingSpinner';
import { useFuncionarios } from '../../hooks/useFuncionario';
import { useDepartamentos } from '../../hooks/useDepartamento';
import { DeleteModal } from './DeleteModal';
import { EditModal } from './EditModal';
import { FuncionarioFilters } from './FuncionarioFilters';
import { FuncionarioTable } from './FuncionarioTable';
import { StyledAlert, TextAlertContainer } from './styles';


export function ManutFuncionarios() {

  const { departamentos } = useDepartamentos();
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

  const [editDepartamentoId, setEditDepartamentoId] = useState<number>(0);

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

  function openEditModal(id: number, nome: string, departamentoId: number)  {
    setChaveEditId(id);
    setEditNome(nome);
    setEditDepartamentoId(departamentoId);
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
    {errorMessage && (
        <TextAlertContainer>
          <StyledAlert variant="danger">{errorMessage}</StyledAlert>
        </TextAlertContainer>
      )}
      {successMessage && (
        <TextAlertContainer>
          <StyledAlert variant="success ">{successMessage}</StyledAlert>
        </TextAlertContainer>
      )}
      <FuncionarioFilters
        filterName={filterName}
        filterId={filterId}
        onChangeFilterName={setFilterName}
        onChangeFilterId={setFilterId}
      />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <FuncionarioTable
          funcionarios={funcionarios}
          filterName={filterName}
          filterId={filterId}
          onEdit={openEditModal}
          onDelete={openModal}
        />
      )}

      <DeleteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        deleteNome={deleteNome}
        deleteId={deleteId}
        loading={loading}
        onConfirm={() => handleDelete(deleteId!, closeModal)}
      />
      <EditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={async (event) => {
          event.preventDefault();
          await handleEditarCadastro(
            chaveEditId,
            editId,
            editNome,
            editDepartamentoId,
            closeEditModal,
          );
        }}
        departamentos={departamentos}
        editId={editId}
        editNome={editNome}
        editDepartamentoId={editDepartamentoId}
        chaveEditId={chaveEditId}
        errorMessageInputModal={errorMessageInputModal}
        onChangeEditId={setEditId}
        onChangeEditNome={setEditNome}
        onChangeEditDepartamentoId={setEditDepartamentoId}
      />
    </>
  );
}
