import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/Modal';
import { Table } from '../../components/Table';
import { useStore, useToastStore, type Professor } from '../../lib/store';

export const ProfessoresPage: React.FC = () => {
  const { professores, addProfessor, updateProfessor, deleteProfessor } = useStore();
  const { addToast } = useToastStore();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<Professor, 'id'>>({ nome: '', email: '', disciplina: '', telefone: '' });
  const resetForm = () => { setForm({ nome: '', email: '', disciplina: '', telefone: '' }); setEditingId(null); };
  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit = (prof: Professor) => {
    setForm({ nome: prof.nome, email: prof.email, disciplina: prof.disciplina, telefone: prof.telefone });
    setEditingId(prof.id); setShowModal(true);
  };

  const handleSave = () => {
    if (!form.nome || !form.disciplina) { addToast('Preencha os campos obrigatórios', 'error'); return; }
    if (editingId) { updateProfessor(editingId, form); addToast('Professor atualizado!', 'success'); }
    else { addProfessor(form); addToast('Professor cadastrado!', 'success'); }
    setShowModal(false); resetForm();
  };

  const handleDelete = (id: string) => { deleteProfessor(id); addToast('Professor excluído', 'info'); setShowDeleteConfirm(null); };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Professores</h1>
          <p className="text-sm text-gray-500">{professores.length} professor(es)</p>
        </div>
        <Button variant="gold" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Novo Professor</Button>
      </div>

      <Card padding={false}>
        <Table
          columns={[
            { key: 'nome', header: 'Nome', render: (p) => <span className="font-medium text-gray-800">{p.nome}</span> },
            { key: 'email', header: 'E-mail', className: 'hidden md:table-cell' },
            { key: 'disciplina', header: 'Disciplina' },
            { key: 'telefone', header: 'Telefone', className: 'hidden lg:table-cell' },
            { key: 'acoes', header: 'Ações', render: (p) => (
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Edit className="w-4 h-4" /></button>
                <button onClick={() => setShowDeleteConfirm(p.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            )},
          ]}
          data={professores}
          keyExtractor={(p) => p.id}
        />
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Editar Professor' : 'Novo Professor'}>
        <div className="space-y-4">
          <Input label="Nome *" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          <Input label="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Disciplina *" value={form.disciplina} onChange={(e) => setForm({ ...form, disciplina: e.target.value })} />
          <Input label="Telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="gold" onClick={handleSave} className="flex-1">Salvar</Button>
        </div>
      </Modal>

      <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Confirmar Exclusão" size="sm">
        <p className="text-gray-600 mb-6">Tem certeza que deseja excluir este professor?</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)}>Cancelar</Button>
          <Button variant="primary" onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700">Excluir</Button>
        </div>
      </Modal>
    </div>
  );
};
