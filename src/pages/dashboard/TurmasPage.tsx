import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/Modal';
import { useStore, useToastStore, type Turma } from '../../lib/store';

export const TurmasPage: React.FC = () => {
  const { turmas, professores, alunos, addTurma, updateTurma, deleteTurma } = useStore();
  const { addToast } = useToastStore();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<Turma, 'id'>>({
    nome: '', serie: '', turno: 'manhã', professorResponsavelId: '',
  });

  const resetForm = () => { setForm({ nome: '', serie: '', turno: 'manhã', professorResponsavelId: '' }); setEditingId(null); };
  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit = (turma: Turma) => {
    setForm({ nome: turma.nome, serie: turma.serie, turno: turma.turno, professorResponsavelId: turma.professorResponsavelId });
    setEditingId(turma.id); setShowModal(true);
  };

  const handleSave = () => {
    if (!form.nome || !form.serie) { addToast('Preencha os campos obrigatórios', 'error'); return; }
    if (editingId) { updateTurma(editingId, form); addToast('Turma atualizada!', 'success'); }
    else { addTurma(form); addToast('Turma criada!', 'success'); }
    setShowModal(false); resetForm();
  };

  const handleDelete = (id: string) => { deleteTurma(id); addToast('Turma excluída', 'info'); setShowDeleteConfirm(null); };

  const getProfessorNome = (id: string) => professores.find((p) => p.id === id)?.nome || '-';
  const getAlunosCount = (turmaId: string) => alunos.filter((a) => a.turmaId === turmaId).length;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Turmas</h1>
          <p className="text-sm text-gray-500">{turmas.length} turma(s)</p>
        </div>
        <Button variant="gold" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Nova Turma</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {turmas.map((turma) => (
          <Card key={turma.id} className="relative">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-primary/5 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(turma)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Edit className="w-4 h-4" /></button>
                <button onClick={() => setShowDeleteConfirm(turma.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <h3 className="font-bold text-gray-800 mb-1">{turma.nome}</h3>
            <p className="text-sm text-gray-500 mb-3">{turma.serie}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" /> {turma.turno}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" /> {getProfessorNome(turma.professorResponsavelId)}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" /> {getAlunosCount(turma.id)} aluno(s)
              </div>
            </div>
          </Card>
        ))}
      </div>

      {turmas.length === 0 && (
        <Card className="text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Nenhuma turma cadastrada</p>
          <Button variant="gold" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Criar Turma</Button>
        </Card>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Editar Turma' : 'Nova Turma'}>
        <div className="space-y-4">
          <Input label="Nome da Turma *" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: 6º Ano A" />
          <Input label="Série *" value={form.serie} onChange={(e) => setForm({ ...form, serie: e.target.value })} placeholder="Ex: 6º Ano" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Turno</label>
            <select value={form.turno} onChange={(e) => setForm({ ...form, turno: e.target.value as any })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="manhã">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="integral">Integral</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Professor Responsável</label>
            <select value={form.professorResponsavelId} onChange={(e) => setForm({ ...form, professorResponsavelId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Selecione...</option>
              {professores.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="gold" onClick={handleSave} className="flex-1">Salvar</Button>
        </div>
      </Modal>

      <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Confirmar Exclusão" size="sm">
        <p className="text-gray-600 mb-6">Tem certeza que deseja excluir esta turma?</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)}>Cancelar</Button>
          <Button variant="primary" onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700">Excluir</Button>
        </div>
      </Modal>
    </div>
  );
};
