import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/Modal';
import { useStore, useToastStore } from '../../lib/store';
import { useEventBus } from '../../lib/eventBus';
import { IACorrigirRedacao } from '../../lib/ai';
import type { FeedbackIA } from '../../lib/store';

export const RedacoesPage: React.FC = () => {
  const { redacoes, alunos, addRedacao, deleteRedacao } = useStore();
  const { addToast } = useToastStore();
  const { emit } = useEventBus();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<{ redacaoId: string; feedback: FeedbackIA } | null>(null);

  const [alunoId, setAlunoId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [feedback, setFeedback] = useState<FeedbackIA | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!texto.trim()) { addToast('Escreva a redação', 'error'); return; }
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2000));
    const result = IACorrigirRedacao(texto);
    setFeedback(result);
    setAnalyzing(false);
    addToast('Análise concluída!', 'success');
  };

  const handleSave = async () => {
    if (!alunoId || !titulo || !feedback) { addToast('Preencha todos os campos', 'error'); return; }
    const aluno = alunos.find((a) => a.id === alunoId);
    addRedacao({ alunoId, alunoNome: aluno?.nome || '', titulo, texto, nota: feedback.nota, feedbackIA: feedback });
    addToast('Redação salva!', 'success');
    setShowModal(false);
    
    // Emitir evento de redação corrigida (notifica aluno e pais)
    await emit('redacao_corrigida', {
      entityId: `red_${Date.now()}`,
      entityName: titulo,
      data: {
        alunoId,
        alunoNome: aluno?.nome,
        titulo,
        nota: feedback.nota,
      },
      priority: 'normal',
    });
    
    resetForm();
  };

  const resetForm = () => { setAlunoId(''); setTitulo(''); setTexto(''); setFeedback(null); };
  const handleDelete = (id: string) => { deleteRedacao(id); addToast('Redação excluída', 'info'); setShowDeleteConfirm(null); };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Redações com IA</h1>
          <p className="text-sm text-gray-500">{redacoes.length} redação(ões)</p>
        </div>
        <Button variant="gold" onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" /> Nova Redação</Button>
      </div>

      {redacoes.length > 0 ? (
        <div className="space-y-4">
          {redacoes.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{r.titulo}</h3>
                  <p className="text-sm text-gray-500">{r.alunoNome} • {r.data}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{r.texto}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <div className="text-center">
                    <p className={`text-2xl font-extrabold ${r.nota >= 800 ? 'text-green-600' : r.nota >= 600 ? 'text-yellow-600' : 'text-red-600'}`}>{r.nota}</p>
                    <p className="text-xs text-gray-400">/1000</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setShowFeedback({ redacaoId: r.id, feedback: r.feedbackIA })} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Sparkles className="w-4 h-4" /></button>
                    <button onClick={() => setShowDeleteConfirm(r.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Nenhuma redação cadastrada</p>
          <Button variant="gold" onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" /> Nova Redação</Button>
        </Card>
      )}

      {/* Modal Nova Redação */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title="Nova Redação" size="xl">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Aluno *</label>
              <select value={alunoId} onChange={(e) => setAlunoId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Selecione...</option>
                {alunos.filter((a) => a.status === 'ativo').map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
              </select>
            </div>
            <Input label="Título *" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Texto da Redação</label>
            <textarea value={texto} onChange={(e) => setTexto(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none h-48" placeholder="Cole ou digite a redação aqui..." />
            <p className="text-xs text-gray-400 mt-1">{texto.length} caracteres • {texto.split(/\s+/).filter(Boolean).length} palavras</p>
          </div>

          <Button variant="primary" onClick={handleAnalyze} loading={analyzing} className="w-full">
            <Sparkles className="w-4 h-4 mr-2" /> {analyzing ? 'Analisando com IA...' : 'Analisar com IA'}
          </Button>

          {feedback && (
            <div className="space-y-4 animate-fade-in border border-gray-200 rounded-xl p-4">
              <div className="text-center bg-primary/5 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Nota IA</p>
                <p className={`text-4xl font-extrabold ${feedback.nota >= 800 ? 'text-green-600' : feedback.nota >= 600 ? 'text-yellow-600' : 'text-red-600'}`}>{feedback.nota}<span className="text-lg font-normal text-gray-400">/1000</span></p>
              </div>
              <p className="text-sm text-gray-700">{feedback.feedback}</p>
              <div>
                <h4 className="text-sm font-semibold text-green-700 mb-2">✓ Pontos Fortes</h4>
                <ul className="space-y-1">{feedback.pontosFortes.map((p, i) => <li key={i} className="text-xs text-gray-600">• {p}</li>)}</ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-yellow-700 mb-2">⚠ Pontos a Melhorar</h4>
                <ul className="space-y-1">{feedback.pontosMelhorar.map((p, i) => <li key={i} className="text-xs text-gray-600">• {p}</li>)}</ul>
              </div>
              {feedback.errosGramaticais.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-red-700 mb-2">✗ Erros Gramaticais</h4>
                  <ul className="space-y-1">{feedback.errosGramaticais.map((e, i) => <li key={i} className="text-xs text-gray-600">• {e}</li>)}</ul>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancelar</Button>
            <Button variant="gold" onClick={handleSave} disabled={!feedback} className="flex-1">Salvar Redação</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Feedback */}
      <Modal isOpen={!!showFeedback} onClose={() => setShowFeedback(null)} title="Feedback da IA" size="lg">
        {showFeedback && (
          <div className="space-y-4">
            <div className="text-center bg-primary/5 rounded-xl p-4">
              <p className={`text-4xl font-extrabold ${showFeedback.feedback.nota >= 800 ? 'text-green-600' : showFeedback.feedback.nota >= 600 ? 'text-yellow-600' : 'text-red-600'}`}>{showFeedback.feedback.nota}<span className="text-lg font-normal text-gray-400">/1000</span></p>
            </div>
            <p className="text-sm text-gray-700">{showFeedback.feedback.feedback}</p>
            <div><h4 className="text-sm font-semibold text-green-700 mb-2">✓ Pontos Fortes</h4><ul className="space-y-1">{showFeedback.feedback.pontosFortes.map((p, i) => <li key={i} className="text-xs text-gray-600">• {p}</li>)}</ul></div>
            <div><h4 className="text-sm font-semibold text-yellow-700 mb-2">⚠ Pontos a Melhorar</h4><ul className="space-y-1">{showFeedback.feedback.pontosMelhorar.map((p, i) => <li key={i} className="text-xs text-gray-600">• {p}</li>)}</ul></div>
            {showFeedback.feedback.errosGramaticais.length > 0 && <div><h4 className="text-sm font-semibold text-red-700 mb-2">✗ Erros Gramaticais</h4><ul className="space-y-1">{showFeedback.feedback.errosGramaticais.map((e, i) => <li key={i} className="text-xs text-gray-600">• {e}</li>)}</ul></div>}
          </div>
        )}
      </Modal>

      <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Confirmar Exclusão" size="sm">
        <p className="text-gray-600 mb-6">Tem certeza que deseja excluir esta redação?</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)}>Cancelar</Button>
          <Button variant="primary" onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700">Excluir</Button>
        </div>
      </Modal>
    </div>
  );
};
