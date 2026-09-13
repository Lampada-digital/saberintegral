import React, { useState } from 'react';
import { Plus, Trash2, Video, FileText, BookOpen, HelpCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/Modal';
import { useStore, useToastStore, type MaterialAVA } from '../../lib/store';

export const AvaPage: React.FC = () => {
  const { materiaisAVA, turmas, addMaterialAVA, deleteMaterialAVA } = useStore();
  const { addToast } = useToastStore();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [filterTurma, setFilterTurma] = useState('');
  const [filterTipo, setFilterTipo] = useState('');

  const [form, setForm] = useState<Omit<MaterialAVA, 'id'>>({
    titulo: '', descricao: '', tipo: 'video', turmaId: '', disciplina: '', url: '', conteudo: '',
  });

  const handleSave = () => {
    if (!form.titulo || !form.turmaId) { addToast('Preencha os campos obrigatórios', 'error'); return; }
    addMaterialAVA(form);
    addToast('Material adicionado!', 'success');
    setShowModal(false);
    setForm({ titulo: '', descricao: '', tipo: 'video', turmaId: '', disciplina: '', url: '', conteudo: '' });
  };

  const handleDelete = (id: string) => { deleteMaterialAVA(id); addToast('Material excluído', 'info'); setShowDeleteConfirm(null); };

  const filtered = materiaisAVA.filter((m) => {
    const matchTurma = !filterTurma || m.turmaId === filterTurma;
    const matchTipo = !filterTipo || m.tipo === filterTipo;
    return matchTurma && matchTipo;
  });

  const getTurmaNome = (id: string) => turmas.find((t) => t.id === id)?.nome || '-';

  const tipoIcon = (tipo: string) => {
    const icons = { video: Video, pdf: FileText, atividade: BookOpen, quiz: HelpCircle };
    const Icon = icons[tipo as keyof typeof icons] || BookOpen;
    return <Icon className="w-5 h-5" />;
  };

  const tipoColor = (tipo: string) => {
    const colors = { video: 'bg-blue-50 text-blue-600', pdf: 'bg-red-50 text-red-600', atividade: 'bg-green-50 text-green-600', quiz: 'bg-purple-50 text-purple-600' };
    return colors[tipo as keyof typeof colors] || 'bg-gray-50 text-gray-600';
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">AVA - Ambiente Virtual</h1>
          <p className="text-sm text-gray-500">{materiaisAVA.length} material(is)</p>
        </div>
        <Button variant="gold" onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" /> Novo Material</Button>
      </div>

      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={filterTurma} onChange={(e) => setFilterTurma(e.target.value)} className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm">
            <option value="">Todas as turmas</option>
            {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
          <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)} className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm">
            <option value="">Todos os tipos</option>
            <option value="video">Vídeo</option>
            <option value="pdf">PDF</option>
            <option value="atividade">Atividade</option>
            <option value="quiz">Quiz</option>
          </select>
        </div>
      </Card>

      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((mat) => (
            <Card key={mat.id} hover>
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${tipoColor(mat.tipo)}`}>{tipoIcon(mat.tipo)}</div>
                <button onClick={() => setShowDeleteConfirm(mat.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{mat.titulo}</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{mat.descricao || 'Sem descrição'}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{mat.disciplina || 'Geral'}</span>
                <span className="text-xs text-gray-400">{getTurmaNome(mat.turmaId)}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Nenhum material encontrado</p>
          <Button variant="gold" onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" /> Adicionar Material</Button>
        </Card>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Material AVA" size="lg">
        <div className="space-y-4">
          <Input label="Título *" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
            <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as any })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="video">Vídeo</option>
                <option value="pdf">PDF</option>
                <option value="atividade">Atividade</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Turma *</label>
              <select value={form.turmaId} onChange={(e) => setForm({ ...form, turmaId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Selecione...</option>
                {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
          </div>
          <Input label="Disciplina" value={form.disciplina} onChange={(e) => setForm({ ...form, disciplina: e.target.value })} />
          <Input label="URL (para vídeos)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Conteúdo</label>
            <textarea value={form.conteudo} onChange={(e) => setForm({ ...form, conteudo: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24" placeholder="Conteúdo textual do material..." />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="gold" onClick={handleSave} className="flex-1">Salvar</Button>
        </div>
      </Modal>

      <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Confirmar Exclusão" size="sm">
        <p className="text-gray-600 mb-6">Tem certeza que deseja excluir este material?</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)}>Cancelar</Button>
          <Button variant="primary" onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700">Excluir</Button>
        </div>
      </Modal>
    </div>
  );
};
