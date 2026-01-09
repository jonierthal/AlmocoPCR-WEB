import { useCallback, useEffect, useState } from 'react';

type UseFuncionarioModalsResult = {
  deleteId: number | null;
  deleteNome: string;
  isDeleteModalOpen: boolean;
  openDeleteModal: (id: number, nome: string) => void;
  closeDeleteModal: () => void;
  editId: number;
  editNome: string;
  editDepartamentoId: number;
  chaveEditId: number;
  isEditModalOpen: boolean;
  openEditModal: (id: number, nome: string, departamentoId: number) => void;
  closeEditModal: () => void;
  setEditId: (value: number) => void;
  setEditNome: (value: string) => void;
  setEditDepartamentoId: (value: number) => void;
};

export function useFuncionarioModals(): UseFuncionarioModalsResult {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteNome, setDeleteNome] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [editDepartamentoId, setEditDepartamentoId] = useState<number>(0);
  const [editId, setEditId] = useState<number>(0);
  const [editNome, setEditNome] = useState<string>('');
  const [chaveEditId, setChaveEditId] = useState<number>(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const openDeleteModal = useCallback((id: number, nome: string) => {
    setDeleteId(id);
    setDeleteNome(nome);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteId(null);
    setDeleteNome('');
    setIsDeleteModalOpen(false);
  }, []);

  const openEditModal = useCallback((id: number, nome: string, departamentoId: number) => {
    setChaveEditId(id);
    setEditNome(nome);
    setEditDepartamentoId(departamentoId);
    setIsEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  useEffect(() => {
    setEditId(chaveEditId);
  }, [chaveEditId]);

  return {
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
  };
}