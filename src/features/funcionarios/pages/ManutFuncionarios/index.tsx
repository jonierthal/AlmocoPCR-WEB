import { LoadingSpinner } from '@components';
import {
  useFuncionarioFilters,
  useFuncionarioModals,
  useFuncionarios,
} from '@features/funcionarios/hooks';
import { useDepartamentos } from '@features/departamentos';
import { DeleteModal } from './DeleteModal';
import { EditModal } from './EditModal';
import { FuncionarioFilters } from './FuncionarioFilters';
import { FuncionarioTable } from './FuncionarioTable';
import { TextAlertContainer } from './styles';
import { StyledAlert } from '@styles/shared/modal';

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

  const {
    deleteId,
    deleteNome,
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
    editId,
    editNome,
    editDepartamentoId,
    chaveEditId,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    setEditId,
    setEditNome,
    setEditDepartamentoId,
  } = useFuncionarioModals();

  const { filterName, filterId, onChangeFilterName, onChangeFilterId } = useFuncionarioFilters();

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
        onChangeFilterName={onChangeFilterName}
        onChangeFilterId={onChangeFilterId}
      />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <FuncionarioTable
          funcionarios={funcionarios}
          filterName={filterName}
          filterId={filterId}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        deleteNome={deleteNome}
        deleteId={deleteId}
        loading={loading}
        onConfirm={() => handleDelete(deleteId!, closeDeleteModal)}
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
