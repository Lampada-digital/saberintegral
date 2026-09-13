import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, ChevronDown, ChevronUp, ArrowUp, ArrowDown, Video, FileText, HelpCircle, Link as LinkIcon, Clock, Users } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/Modal';
import { useAVAStore } from '../../../lib/ava-store';
import { useStore } from '../../../lib/store';
import { useToastStore } from '../../../lib/store';
import type { Aula, Modulo, Trilha } from '../../../lib/ava-store';

export const EstudioPage: React.FC = () => {
  const navigate = useNavigate();
  const { trilhas, addTrilha, updateTrilha, deleteTrilha, addModulo, updateModulo, deleteModulo, moveModulo, addAula, updateAula, deleteAula, moveAula } = useAVAStore();
  const { turmas } = useStore();
  const { addToast } = useToastStore();

  const [selectedTrilha, setSelectedTrilha] = useState<string | null>(null);
  const [showTrilhaModal, setShowTrilhaModal] = useState(false);
  const [showModuloModal, setShowModuloModal] = useState(false);
  const [showAulaModal, setShowAulaModal] = useState<{ moduloId: string | null; aulaId?: string }>({ moduloId: null });
  const [expandedModulos, setExpandedModulos] = useState<string[]>([]);

  // Form states
  const [trilhaForm, setTrilhaForm] = useState<Partial<Trilha>>({
    nivel: 'Iniciante',
    certificado: true,
    cor: '#1E3A5F',
  });
  const [moduloForm, setModuloForm] = useState<Partial<Modulo>>({});
  const [aulaForm, setAulaForm] = useState<Partial<Aula>>({
    tipo: 'video',
    visibilidade: 'disponivel',
    duracao: 0,
  });

  const trilha = selectedTrilha ? trilhas.find((t) => t.id === selectedTrilha) : null;

  const handleSaveTrilha = () => {
    if (!trilhaForm.nome || !trilhaForm.turmaId) {
      addToast('Preencha nome e turma', 'error');
      return;
    }
    if (trilhaForm.id) {
      updateTrilha(trilhaForm.id, trilhaForm);
      addToast('Trilha atualizada!', 'success');
    } else {
      const id = addTrilha(trilhaForm as any);
      setSelectedTrilha(id);
      addToast('Trilha criada!', 'success');
    }
    setShowTrilhaModal(false);
    setTrilhaForm({ nivel: 'Iniciante', certificado: true, cor: '#1E3A5F' });
  };

  const handleSaveModulo = () => {
    if (!selectedTrilha || !moduloForm.nome) {
      addToast('Preencha o nome do módulo', 'error');
      return;
    }
    const ordem = trilha ? trilha.modulos.length + 1 : 1;
    addModulo(selectedTrilha, { ...moduloForm, ordem, aulas: [] } as any);
    addToast('Módulo adicionado!', 'success');
    setShowModuloModal(false);
    setModuloForm({});
  };

  const handleSaveAula = () => {
    if (!showAulaModal.moduloId || !aulaForm.titulo) {
      addToast('Preencha o título da aula', 'error');
      return;
    }
    if (!selectedTrilha) return;
    const modulo = trilha?.modulos.find((m) => m.id === showAulaModal.moduloId);
    const ordem = modulo ? modulo.aulas.length + 1 : 1;
    addAula(selectedTrilha, showAulaModal.moduloId, { ...aulaForm, ordem } as any);
    addToast('Aula adicionada!', 'success');
    setShowAulaModal({ moduloId: null });
    setAulaForm({ tipo: 'video', visibilidade: 'disponivel', duracao: 0 });
  };

  const toggleModulo = (id: string) => {
    setExpandedModulos((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  };

  const getTipoIcon = (tipo: string) => {
    const icons = { video: Video, pdf: FileText, quiz: HelpCircle, link: LinkIcon };
    const Icon = icons[tipo as keyof typeof icons] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Estúdio de Criação AVA</h1>
          <p className="text-sm text-gray-500">Crie e gerencie trilhas, módulos e aulas</p>
        </div>
        <Button variant="gold" onClick={() => { setTrilhaForm({ nivel: 'Iniciante', certificado: true, cor: '#1E3A5F' }); setShowTrilhaModal(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Nova Trilha
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lista de Trilhas */}
        <Card>
          <h3 className="font-bold text-gray-800 mb-4">Trilhas ({trilhas.length})</h3>
          <div className="space-y-2">
            {trilhas.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTrilha(t.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedTrilha === t.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.cor }} />
                  <span className="font-medium text-sm text-gray-800 truncate">{t.nome}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{t.modulos.length} módulos</span>
                  <span>•</span>
                  <span>{t.modulos.reduce((acc, m) => acc + m.aulas.length, 0)} aulas</span>
                </div>
              </button>
            ))}
            {trilhas.length === 0 && (
              <p className="text-center text-gray-400 py-8 text-sm">Nenhuma trilha criada</p>
            )}
          </div>
        </Card>

        {/* Detalhes da Trilha */}
        <div className="lg:col-span-2">
          {trilha ? (
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: trilha.cor }} />
                    <h2 className="text-xl font-bold text-gray-800">{trilha.nome}</h2>
                  </div>
                  <p className="text-sm text-gray-500">{trilha.descricao}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{trilha.disciplina}</span>
                    <span>•</span>
                    <span>{trilha.nivel}</span>
                    <span>•</span>
                    <span>{trilha.certificado ? 'Com certificado' : 'Sem certificado'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setTrilhaForm(trilha); setShowTrilhaModal(true); }}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/portal/ava/trilha/${trilha.id}`)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-700">Módulos</h3>
                  <Button variant="outline" size="sm" onClick={() => setShowModuloModal(true)}>
                    <Plus className="w-4 h-4 mr-1" /> Módulo
                  </Button>
                </div>

                {trilha.modulos.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">Nenhum módulo criado</p>
                ) : (
                  <div className="space-y-3">
                    {trilha.modulos.sort((a, b) => a.ordem - b.ordem).map((modulo) => (
                      <div key={modulo.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between p-3 bg-gray-50">
                          <button onClick={() => toggleModulo(modulo.id)} className="flex items-center gap-2 flex-1 text-left">
                            {expandedModulos.includes(modulo.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            <span className="font-medium text-sm">{modulo.nome}</span>
                            <span className="text-xs text-gray-400">({modulo.aulas.length} aulas)</span>
                          </button>
                          <div className="flex gap-1">
                            <button onClick={() => moveModulo(trilha.id, modulo.id, 'up')} className="p-1 hover:bg-gray-200 rounded"><ArrowUp className="w-3 h-3" /></button>
                            <button onClick={() => moveModulo(trilha.id, modulo.id, 'down')} className="p-1 hover:bg-gray-200 rounded"><ArrowDown className="w-3 h-3" /></button>
                            <button onClick={() => { if (confirm('Excluir módulo?')) deleteModulo(trilha.id, modulo.id); }} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                        {expandedModulos.includes(modulo.id) && (
                          <div className="p-3 space-y-2">
                            {modulo.aulas.sort((a, b) => a.ordem - b.ordem).map((aula) => (
                              <div key={aula.id} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-100">
                                {getTipoIcon(aula.tipo)}
                                <span className="text-sm flex-1 truncate">{aula.titulo}</span>
                                <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{Math.round(aula.duracao / 60)}min</span>
                                <div className="flex gap-1">
                                  <button onClick={() => moveAula(trilha.id, modulo.id, aula.id, 'up')} className="p-1 hover:bg-gray-100 rounded"><ArrowUp className="w-3 h-3" /></button>
                                  <button onClick={() => moveAula(trilha.id, modulo.id, aula.id, 'down')} className="p-1 hover:bg-gray-100 rounded"><ArrowDown className="w-3 h-3" /></button>
                                  <button onClick={() => { setAulaForm(aula); setShowAulaModal({ moduloId: modulo.id, aulaId: aula.id }); }} className="p-1 hover:bg-blue-50 text-blue-500 rounded"><Edit className="w-3 h-3" /></button>
                                  <button onClick={() => { if (confirm('Excluir aula?')) deleteAula(trilha.id, modulo.id, aula.id); }} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                </div>
                              </div>
                            ))}
                            <Button variant="ghost" size="sm" onClick={() => { setAulaForm({ tipo: 'video', visibilidade: 'disponivel', duracao: 0 }); setShowAulaModal({ moduloId: modulo.id }); }} className="w-full">
                              <Plus className="w-4 h-4 mr-1" /> Adicionar Aula
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Selecione uma trilha para editar</p>
            </Card>
          )}
        </div>
      </div>

      {/* Modal Trilha */}
      <Modal isOpen={showTrilhaModal} onClose={() => setShowTrilhaModal(false)} title={trilhaForm.id ? 'Editar Trilha' : 'Nova Trilha'} size="lg">
        <div className="space-y-4">
          <Input label="Nome *" value={trilhaForm.nome || ''} onChange={(e) => setTrilhaForm({ ...trilhaForm, nome: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
            <textarea value={trilhaForm.descricao || ''} onChange={(e) => setTrilhaForm({ ...trilhaForm, descricao: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm resize-none h-20" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Turma *</label>
              <select value={trilhaForm.turmaId || ''} onChange={(e) => setTrilhaForm({ ...trilhaForm, turmaId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm">
                <option value="">Selecione...</option>
                {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
            <Input label="Disciplina" value={trilhaForm.disciplina || ''} onChange={(e) => setTrilhaForm({ ...trilhaForm, disciplina: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nível</label>
              <select value={trilhaForm.nivel} onChange={(e) => setTrilhaForm({ ...trilhaForm, nivel: e.target.value as any })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm">
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cor</label>
              <input type="color" value={trilhaForm.cor || '#1E3A5F'} onChange={(e) => setTrilhaForm({ ...trilhaForm, cor: e.target.value })} className="w-full h-10 rounded cursor-pointer" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={trilhaForm.certificado || false} onChange={(e) => setTrilhaForm({ ...trilhaForm, certificado: e.target.checked })} className="rounded" />
            <span className="text-sm text-gray-700">Emitir certificado ao concluir</span>
          </label>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowTrilhaModal(false)}>Cancelar</Button>
            <Button variant="gold" onClick={handleSaveTrilha} className="flex-1">Salvar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Módulo */}
      <Modal isOpen={showModuloModal} onClose={() => setShowModuloModal(false)} title="Novo Módulo">
        <div className="space-y-4">
          <Input label="Nome *" value={moduloForm.nome || ''} onChange={(e) => setModuloForm({ ...moduloForm, nome: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
            <textarea value={moduloForm.descricao || ''} onChange={(e) => setModuloForm({ ...moduloForm, descricao: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm resize-none h-20" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowModuloModal(false)}>Cancelar</Button>
            <Button variant="gold" onClick={handleSaveModulo} className="flex-1">Salvar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Aula */}
      <Modal isOpen={!!showAulaModal.moduloId} onClose={() => setShowAulaModal({ moduloId: null })} title={aulaForm.id ? 'Editar Aula' : 'Nova Aula'} size="lg">
        <div className="space-y-4">
          <Input label="Título *" value={aulaForm.titulo || ''} onChange={(e) => setAulaForm({ ...aulaForm, titulo: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
            <textarea value={aulaForm.descricao || ''} onChange={(e) => setAulaForm({ ...aulaForm, descricao: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm resize-none h-20" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo</label>
              <select value={aulaForm.tipo} onChange={(e) => setAulaForm({ ...aulaForm, tipo: e.target.value as any })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm">
                <option value="video">Vídeo</option>
                <option value="pdf">PDF</option>
                <option value="quiz">Quiz</option>
                <option value="tarefa">Tarefa</option>
                <option value="link">Link Externo</option>
                <option value="apresentacao">Apresentação</option>
              </select>
            </div>
            <Input label="Duração (segundos)" type="number" value={aulaForm.duracao?.toString() || '0'} onChange={(e) => setAulaForm({ ...aulaForm, duracao: parseInt(e.target.value) || 0 })} />
          </div>
          {(aulaForm.tipo === 'video' || aulaForm.tipo === 'link') && (
            <Input label="URL" value={aulaForm.url || aulaForm.linkExterno || ''} onChange={(e) => setAulaForm({ ...aulaForm, url: e.target.value, linkExterno: e.target.value })} placeholder="https://..." />
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Data de Liberação" type="date" value={aulaForm.liberacao || ''} onChange={(e) => setAulaForm({ ...aulaForm, liberacao: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Visibilidade</label>
              <select value={aulaForm.visibilidade} onChange={(e) => setAulaForm({ ...aulaForm, visibilidade: e.target.value as any })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm">
                <option value="disponivel">Disponível agora</option>
                <option value="programado">Programado</option>
                <option value="oculto">Oculto</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowAulaModal({ moduloId: null })}>Cancelar</Button>
            <Button variant="gold" onClick={handleSaveAula} className="flex-1">Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
