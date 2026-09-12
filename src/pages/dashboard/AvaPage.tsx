import React, { useState, useRef } from 'react';
import { Plus, BookOpen, FileText, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useAvaStore, useToastStore } from '../../stores';
import { v4 as uuidv4 } from 'uuid';

export const AvaPage: React.FC = () => {
  const { trails, addTrail, removeTrail } = useAvaStore();
  const { addToast } = useToastStore();
  const [showNewTrail, setShowNewTrail] = useState(false);
  const [showEssayCorrection, setShowEssayCorrection] = useState(false);
  const [trailTitle, setTrailTitle] = useState('');
  const [trailDescription, setTrailDescription] = useState('');
  const [trailSubject, setTrailSubject] = useState('');
  const [trailFiles, setTrailFiles] = useState<string[]>([]);
  const [essayText, setEssayText] = useState('');
  const [essayFeedback, setEssayFeedback] = useState<null | {
    nota: number;
    competencias: { nome: string; nota: number; feedback: string }[];
    sugestoes: string[];
  }>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const names = Array.from(files).map((f) => f.name);
      setTrailFiles([...trailFiles, ...names]);
      addToast(`${names.length} arquivo(s) adicionado(s)`, 'success');
    }
  };

  const handleCreateTrail = () => {
    if (!trailTitle || !trailSubject) {
      addToast('Preencha título e disciplina', 'error');
      return;
    }
    const trail = {
      id: uuidv4(),
      title: trailTitle,
      description: trailDescription,
      subject: trailSubject,
      files: trailFiles,
      createdAt: new Date().toISOString(),
    };
    addTrail(trail);
    addToast('Trilha criada com sucesso!', 'success');
    setShowNewTrail(false);
    setTrailTitle('');
    setTrailDescription('');
    setTrailSubject('');
    setTrailFiles([]);
  };

  const handleAnalyzeEssay = async () => {
    if (!essayText.trim()) {
      addToast('Escreva a redação para analisar', 'error');
      return;
    }
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 3000));
    
    const wordCount = essayText.split(/\s+/).length;
    const baseScore = Math.min(1000, Math.max(200, wordCount * 3 + Math.random() * 200));
    
    setEssayFeedback({
      nota: Math.round(baseScore),
      competencias: [
        { nome: 'Competência 1 - Norma Culta', nota: Math.round(100 + Math.random() * 100), feedback: wordCount > 100 ? 'Bom domínio da norma culta. Atenção à concordância verbal em períodos longos.' : 'Texto muito curto. Desenvolva melhor as ideias para demonstrar domínio da norma.' },
        { nome: 'Competência 2 - Compreensão do Tema', nota: Math.round(100 + Math.random() * 100), feedback: 'O tema foi compreendido. Articule melhor os argumentos ao longo do texto.' },
        { nome: 'Competência 3 - Argumentação', nota: Math.round(80 + Math.random() * 120), feedback: 'Argumentos presentes, mas podem ser aprofundados com dados e exemplos concretos.' },
        { nome: 'Competência 4 - Coesão', nota: Math.round(100 + Math.random() * 100), feedback: 'Use mais conectivos para ligar as ideias. Evite repetições de termos.' },
        { nome: 'Competência 5 - Proposta de Intervenção', nota: Math.round(60 + Math.random() * 140), feedback: 'Inclua uma proposta de intervenção com agente, ação, meio e finalidade.' },
      ],
      sugestoes: [
        'Revise a pontuação e acentuação do texto',
        'Utilize repertório sociocultural para fortalecer a argumentação',
        'Estruture o texto em introdução, desenvolvimento e conclusão claras',
        'Inclua dados estatísticos ou citações de autoridades no assunto',
      ],
    });
    setAnalyzing(false);
    addToast('Análise concluída!', 'success');
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ambiente Virtual de Aprendizagem</h1>
          <p className="text-sm text-gray-500">Gerencie trilhas de aprendizagem e corrija redações</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEssayCorrection(true)}>
            <Sparkles className="w-4 h-4 mr-2" /> Corrigir Redação
          </Button>
          <Button variant="gold" onClick={() => setShowNewTrail(true)}>
            <Plus className="w-4 h-4 mr-2" /> Nova Trilha
          </Button>
        </div>
      </div>

      {/* Trails List */}
      {trails.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trails.map((trail) => (
            <Card key={trail.id} hover>
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-primary/5 rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <button onClick={() => { removeTrail(trail.id); addToast('Trilha removida', 'info'); }} className="p-1 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{trail.title}</h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{trail.description || 'Sem descrição'}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{trail.subject}</span>
                <span className="text-xs text-gray-400">{trail.files.length} arquivos</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Nenhuma trilha criada ainda</p>
          <Button variant="gold" onClick={() => setShowNewTrail(true)}>
            <Plus className="w-4 h-4 mr-2" /> Criar Primeira Trilha
          </Button>
        </Card>
      )}

      {/* New Trail Modal */}
      <Modal isOpen={showNewTrail} onClose={() => setShowNewTrail(false)} title="Nova Trilha de Aprendizagem" size="lg">
        <div className="space-y-4">
          <Input label="Título da Trilha" placeholder="Ex: Trilha de Matemática - 9º ano" value={trailTitle} onChange={(e) => setTrailTitle(e.target.value)} />
          <Input label="Disciplina" placeholder="Ex: Matemática" value={trailSubject} onChange={(e) => setTrailSubject(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
            <textarea
              value={trailDescription}
              onChange={(e) => setTrailDescription(e.target.value)}
              placeholder="Descreva os objetivos e conteúdo da trilha..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none h-24"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Materiais</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Clique para adicionar arquivos</p>
              <p className="text-xs text-gray-400">PDF, DOC, imagens, vídeos</p>
            </div>
            <input ref={fileInputRef} type="file" multiple onChange={handleFileUpload} className="hidden" />
            {trailFiles.length > 0 && (
              <div className="mt-3 space-y-1">
                {trailFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                    <FileText className="w-4 h-4 text-gray-400" /> {f}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowNewTrail(false)}>Cancelar</Button>
            <Button variant="gold" onClick={handleCreateTrail} className="flex-1">Criar Trilha</Button>
          </div>
        </div>
      </Modal>

      {/* Essay Correction Modal */}
      <Modal isOpen={showEssayCorrection} onClose={() => { setShowEssayCorrection(false); setEssayFeedback(null); setEssayText(''); }} title="Correção de Redação com IA" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cole a redação do aluno</label>
            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Cole aqui o texto da redação para análise..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none h-40"
            />
            <p className="text-xs text-gray-400 mt-1">{essayText.split(/\s+/).filter(Boolean).length} palavras</p>
          </div>

          <Button variant="gold" onClick={handleAnalyzeEssay} loading={analyzing} className="w-full">
            <Sparkles className="w-4 h-4 mr-2" />
            {analyzing ? 'Analisando redação...' : 'Analisar Redação'}
          </Button>

          {essayFeedback && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-primary/5 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Nota Geral</p>
                <p className="text-4xl font-extrabold text-primary">{essayFeedback.nota}<span className="text-lg font-normal text-gray-400">/1000</span></p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Competências</h4>
                <div className="space-y-3">
                  {essayFeedback.competencias.map((comp, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{comp.nome}</span>
                        <span className={`text-sm font-bold ${comp.nota >= 160 ? 'text-green-600' : comp.nota >= 120 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {comp.nota}/200
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{comp.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Sugestões de Melhoria</h4>
                <ul className="space-y-2">
                  {essayFeedback.sugestoes.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-gold font-bold mt-0.5">→</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
