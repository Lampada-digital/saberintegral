import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/Modal';
import { Table } from '../../components/Table';
import { useStore, useToastStore, type Aluno } from '../../lib/store';

export const AlunosPage: React.FC = () => {
  const { alunos, turmas, addAluno, updateAluno, deleteAluno } = useStore();
  const { addToast } = useToastStore();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterTurma, setFilterTurma] = useState('');

  const [form, setForm] = useState<Omit<Aluno, 'id'>>({
    nome: '', email: '', turmaId: '', responsavel: '', telefone: '', dataNascimento: '', status: 'ativo',
  });

  const resetForm = () => {
    setForm({ nome: '', email: '', turmaId: '', responsavel: '', telefone: '', dataNascimento: '', status: 'ativo' });
    setEditingId(null);
  };

  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit = (aluno: Aluno) => {
    setForm({ nome: aluno.nome, email: aluno.email, turmaId: aluno.turmaId, responsavel: aluno.responsavel, telefone: aluno.telefone, dataNascimento: aluno.dataNascimento, status: aluno.status });
    setEditingId(aluno.id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.nome || !form.email || !form.turmaId) {
      addToast('Preencha os campos obrigatórios', 'error');
      return;
    }
    if (editingId) {
      updateAluno(editingId, form);
      addToast('Aluno atualizado!', 'success');
    } else {
      addAluno(form);
      addToast('Aluno cadastrado!', 'success');
    }
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteAluno(id);
    addToast('Aluno excluído', 'info');
    setShowDeleteConfirm(null);
  };

  const filtered = alunos.filter((a) => {
    const matchSearch = a.nome.toLowerCase().includes(search.toLowerCase()) || a.responsavel.toLowerCase().includes(search.toLowerCase());
    const matchTurma = !filterTurma || a.turmaId === filterTurma;
    return matchSearch && matchTurma;
  });

  const getTurmaNome = (id: string) => turmas.find((t) => t.id === id)?.nome || '-';

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Alunos</h1>
          <p className="text-sm text-gray-500">{alunos.length} aluno(s) cadastrado(s)</p>
        </div>
        <Button variant="gold" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Novo Aluno</Button>
      </div>

      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Buscar por nome ou responsável..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <select value={filterTurma} onChange={(e) => setFilterTurma(e.target.value)} className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Todas as turmas</option>
            {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
        </div>
      </Card>

      <Card padding={false}>
        <Table
          columns={[
            { key: 'nome', header: 'Nome', render: (a) => <span className="font-medium text-gray-800">{a.nome}</span> },
            { key: 'turma', header: 'Turma', render: (a) => getTurmaNome(a.turmaId) },
            { key: 'responsavel', header: 'Responsável', className: 'hidden md:table-cell' },
            { key: 'telefone', header: 'Telefone', className: 'hidden lg:table-cell' },
            { key: 'status', header: 'Status', render: (a) => (
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${a.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.status}</span>
            )},
            { key: 'acoes', header: 'Ações', render: (a) => (
              <div className="flex gap-2">
                <button onClick={() => openEdit(a)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Edit className="w-4 h-4" /></button>
                <button onClick={() => setShowDeleteConfirm(a.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            )},
          ]}
          data={filtered}
          keyExtractor={(a) => a.id}
        />
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Editar Aluno' : 'Novo Aluno'} size="lg">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Nome *" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome completo" />
          <Input label="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@exemplo.com" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Turma *</label>
            <select value={form.turmaId} onChange={(e) => setForm({ ...form, turmaId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Selecione...</option>
              {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </div>
          <Input label="Responsável" value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} />
          <Input label="Telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="(00) 00000-0000" />
          <Input label="Data de Nascimento" type="date" value={form.dataNascimento} onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="gold" onClick={handleSave} className="flex-1">Salvar</Button>
        </div>
      </Modal>

      <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Confirmar Exclusão" size="sm">
        <p className="text-gray-600 mb-6">Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)}>Cancelar</Button>
          <Button variant="primary" onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700">Excluir</Button>
        </div>
      </Modal>
    </div>
  );
};
