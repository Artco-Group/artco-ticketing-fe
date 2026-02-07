import { useState } from 'react';

export function useProjectModal<T>() {
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProject, setEditingProject] = useState<T | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<T | null>(null);

  const openCreateModal = () => {
    setEditingProject(null);
    setShowFormModal(true);
  };

  const openEditModal = (project: T) => {
    setEditingProject(project);
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setEditingProject(null);
  };

  const openDeleteConfirm = (project: T) => {
    setProjectToDelete(project);
  };

  const closeDeleteConfirm = () => {
    setProjectToDelete(null);
  };

  return {
    showFormModal,
    editingProject,
    projectToDelete,
    isEditing: !!editingProject,
    openCreateModal,
    openEditModal,
    closeFormModal,
    openDeleteConfirm,
    closeDeleteConfirm,
  };
}
