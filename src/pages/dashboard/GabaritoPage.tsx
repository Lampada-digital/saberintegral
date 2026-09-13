import React, { useState } from 'react';
import { Plus, Trash2, PenTool, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/Modal';
import { useStore, useToastStore, type Questao } from '../../lib/store';

export const GabaritoPage: React.FC = () => {
  const { gabaritos, turmas, alunos, addGabarito, deleteGabarito, corrigirProva } = useStore();
  const { addToast } = useToastStore();
  const [showNewExam, setShowNewExam] = useState(false);
  const [showCorrigir, setShowCorrigir] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [examTitle, setExamTitle] = useState('');
  const [examTurma, setExamTurma] = useState('');
  const [examDisciplina, setExamDisciplina] = useState('');
  const [examData, setExamData] = useState('');
  const [questoes, setQuestoes] = useState<Questao[]>([{ numero: 1, gabarito: 'A', peso: 1, bncc: '' }]);

  const [corrigirAlunoId, setCorrigirAlunoId] = useState('');
  const [respostas, setRespostas] = useState<string[]>([]);

  const addQuestao = () => setQuestoes([...questoes, { numero: questoes.length + 1, gabarito: 'A', peso: 1, bncc: '' }]);
  const removeQuestao = (idx: number) => setQuestoes(questoes.filter((_, i) => i !== idx));
  const updateQuestao = (idx: number, field: keyof Questao, value: any) => {
    const updated = [...questoes];
    updated[idx] = { ...updated[idx], [field]: value };
    setQuestoes(updated);
  };

  const handleCreateExam = () => {
    if (!examTitle || !examTurma || questoes.length === 0) {
      addToast('Preencha todos os campos', 'error');
      return;
    }
    addGabarito({ titulo: examTitle, turmaId: examTurma, disciplina: examDisciplina, data: examData, questoes });
    addToast('Prova criada com sucesso!', 'success');
    setShowNewExam(false);
    setExamTitle(''); setExamTurma(''); setExamDisciplina(''); setExamData('');
    setQuestoes([{ numero: 1, gabarito: 'A', peso: 1, bncc: '' }]);
  };

  const openCorrigir = (gabaritoId: string) => {
    const gabarito = gabaritos.find((g) => g.id === gabaritoId);
    if (!gabarito) return;
    setShowCorrigir(gabaritoId);
    setCorrigirAlunoId('');
    setRespostas(gabarito.questoes.map(() => ''));
  };

  const handleCorrigir = () => {
    if (!showCorrigir || !corrigirAlunoId) {
      addToast('Selecione um aluno', 'error');
      return;
    }
    if (respostas.some((r) => !r)) {
      addToast('Responda todas as questões', 'error');
      return;
    }
    const resultado = corrigirProva(showCorrigir, corrigirAlunoId, respostas);
    addToast(`Nota: ${resultado.nota}/10 - Correção salva!`, 'success');
    setShowCorrigir(null);
  };

  const handleDelete = (id: string) => { deleteGabarito(id); addToast('Prova excluída', 'info'); setShowDeleteConfirm(null); };
  const getTurmaNome = (id: string) => turmas.find((t) => t.id === id)?.nome || '-';
  const getAlunosTurma = (turmaId: string) => alunos.filter((a) => a.turmaId === turmaId && a.status === 'ativo');

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gabarito</h1>
          <p className="text-sm text-gray-500">{gabaritos.length} prova(s) cadastrada(s)</p>
        </div>
        <Button variant="gold" onClick={() => setShowNewExam(true)}><Plus className="w-4 h-4 mr-2" /> Nova Prova</Button>
      </div>

      {gabaritos.length > 0 ? (
        <div className="space-y-4">
          {gabaritos.map((gabarito) => (
            <Card key={gabarito.id}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-800">{gabarito.titulo}</h3>
                  <p className="text-sm text-gray-500">{getTurmaNome(gabarito.turmaId)} • {gabarito.disciplina} • {gabarito.questoes.length} questões</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => openCorrigir(gabarito.id)}><PenTool className="w-4 h-4 mr-1" /> Corrigir</Button>
                  <button onClick={() => setShowDeleteConfirm(gabarito.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {gabarito.notas.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Notas registradas:</p>
                  <div className="flex flex-wrap gap-2">
                    {gabarito.notas.map((n) => (
                      <span key={n.alunoId} className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                        {n.alunoNome}: <span className={`font-bold ${n.nota >= 7 ? 'text-green-600' : n.nota >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>{n.nota}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <PenTool className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Nenhuma prova cadastrada</p>
          <Button variant="gold" onClick={() => setShowNewExam(true)}><Plus className="w-4 h-4 mr-2" /> Criar Prova</Button>
        </Card>
      )}

      {/* Modal Nova Prova */}
      <Modal isOpen={showNewExam} onClose={() => setShowNewExam(false)} title="Nova Prova" size="xl">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Título *" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} />
            <Input label="Disciplina" value={examDisciplina} onChange={(e) => setExamDisciplina(e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Turma *</label>
              <select value={examTurma} onChange={(e) => setExamTurma(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Selecione...</option>
                {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
            <Input label="Data" type="date" value={examData} onChange={(e) => setExamData(e.target.value)} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Questões</label>
              <Button variant="ghost" size="sm" onClick={addQuestao}><Plus className="w-4 h-4 mr-1" /> Adicionar</Button>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {questoes.map((q, idx) => (
                <div key={idx} className="flex items-end gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12"><label className="text-xs text-gray-500">Nº</label><input type="number" value={q.numero} onChange={(e) => updateQuestao(idx, 'numero', parseInt(e.target.value))} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" /></div>
                  <div className="w-16"><label className="text-xs text-gray-500">Gab.</label><select value={q.gabarito} onChange={(e) => updateQuestao(idx, 'gabarito', e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option></select></div>
                  <div className="w-16"><label className="text-xs text-gray-500">Peso</label><input type="number" value={q.peso} onChange={(e) => updateQuestao(idx, 'peso', parseFloat(e.target.value))} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" /></div>
                  <div className="flex-1"><label className="text-xs text-gray-500">BNCC</label><input value={q.bncc} onChange={(e) => updateQuestao(idx, 'bncc', e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm" placeholder="Código" /></div>
                  {questoes.length > 1 && <button onClick={() => removeQuestao(idx)} className="p-1.5 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowNewExam(false)}>Cancelar</Button>
            <Button variant="gold" onClick={handleCreateExam} className="flex-1">Criar Prova</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Corrigir */}
      <Modal isOpen={!!showCorrigir} onClose={() => setShowCorrigir(null)} title="Corrigir Prova" size="lg">
        {showCorrigir && (() => {
          const gabarito = gabaritos.find((g) => g.id === showCorrigir);
          if (!gabarito) return null;
          const alunosTurma = getAlunosTurma(gabarito.turmaId);
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Aluno *</label>
                <select value={corrigirAlunoId} onChange={(e) => setCorrigirAlunoId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Selecione o aluno...</option>
                  {alunosTurma.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Respostas do Aluno</label>
                <div className="space-y-2">
                  {gabarito.questoes.map((q, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-600 w-16">Questão {q.numero}</span>
                      <select value={respostas[idx]} onChange={(e) => { const r = [...respostas]; r[idx] = e.target.value; setRespostas(r); }} className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm">
                        <option value="">-</option>
                        <option>A</option><option>B</option><option>C</option><option>D</option><option>E</option>
                      </select>
                      <span className="text-xs text-gray-400">Gab: {q.gabarito}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={() => setShowCorrigir(null)}>Cancelar</Button>
                <Button variant="gold" onClick={handleCorrigir} className="flex-1"><CheckCircle className="w-4 h-4 mr-2" /> Corrigir e Salvar</Button>
              </div>
            </div>
          );
        })()}
      </Modal>

      <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Confirmar Exclusão" size="sm">
        <p className="text-gray-600 mb-6">Tem certeza que deseja excluir esta prova?</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)}>Cancelar</Button>
          <Button variant="primary" onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700">Excluir</Button>
        </div>
      </Modal>
    </div>
  );
};
