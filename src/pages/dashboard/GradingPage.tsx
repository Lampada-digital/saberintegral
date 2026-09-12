import React, { useState, useRef } from 'react';
import { Plus, Trash2, Camera, Upload, FileText, CheckCircle } from 'lucide-react';
import Papa from 'papaparse';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useGradingStore, useToastStore } from '../../stores';
import { v4 as uuidv4 } from 'uuid';

interface QuestionForm {
  number: string;
  answer: string;
  weight: string;
  bncc: string;
}

export const GradingPage: React.FC = () => {
  const { exams, addExam } = useGradingStore();
  const { addToast } = useToastStore();
  const [showNewExam, setShowNewExam] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [examTitle, setExamTitle] = useState('');
  const [examSubject, setExamSubject] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([{ number: '1', answer: 'A', weight: '1', bncc: '' }]);
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<{ student: string; score: number; total: number }[] | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addQuestion = () => {
    setQuestions([...questions, { number: String(questions.length + 1), answer: 'A', weight: '1', bncc: '' }]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, field: keyof QuestionForm, value: string) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], [field]: value };
    setQuestions(updated);
  };

  const handleCreateExam = () => {
    if (!examTitle || !examSubject) {
      addToast('Preencha título e disciplina', 'error');
      return;
    }
    const exam = {
      id: uuidv4(),
      title: examTitle,
      subject: examSubject,
      questions: questions.map((q) => ({
        id: uuidv4(),
        number: parseInt(q.number),
        answer: q.answer.toUpperCase(),
        weight: parseFloat(q.weight) || 1,
        bncc: q.bncc,
      })),
      createdAt: new Date().toISOString(),
    };
    addExam(exam);
    addToast('Prova criada com sucesso!', 'success');
    setShowNewExam(false);
    setExamTitle('');
    setExamSubject('');
    setQuestions([{ number: '1', answer: 'A', weight: '1', bncc: '' }]);
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      addToast('Não foi possível acessar a câmera. Verifique as permissões.', 'error');
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const handleScan = async () => {
    setScanning(true);
    stopCamera();
    await new Promise((r) => setTimeout(r, 2000));
    const mockResults = [
      { student: 'Maria Silva', score: 8.5, total: 10 },
      { student: 'João Santos', score: 7.0, total: 10 },
      { student: 'Ana Oliveira', score: 9.5, total: 10 },
      { student: 'Pedro Costa', score: 6.0, total: 10 },
      { student: 'Lucia Ferreira', score: 8.0, total: 10 },
    ];
    setScanResults(mockResults);
    setScanning(false);
    addToast('Correção concluída! 5 provas processadas.', 'success');
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data as Record<string, string>[];
        if (data.length === 0) {
          addToast('Arquivo CSV vazio', 'error');
          return;
        }
        // Simulate grading based on CSV data
        const graded = data.map((row) => {
          const answers = Object.values(row);
          const studentName = answers[0] || 'Aluno';
          let correct = 0;
          const exam = exams[exams.length - 1];
          if (exam) {
            exam.questions.forEach((q, idx) => {
              if (answers[idx + 1]?.toUpperCase().trim() === q.answer) {
                correct += q.weight;
              }
            });
          } else {
            correct = Math.random() * 10;
          }
          return { student: studentName, score: Math.round(correct * 10) / 10, total: 10 };
        });
        setScanResults(graded);
        addToast(`${graded.length} provas corrigidas via CSV!`, 'success');
      },
      error: () => {
        addToast('Erro ao ler o arquivo CSV', 'error');
      },
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Módulo Gabarito</h1>
          <p className="text-sm text-gray-500">Crie provas, escaneie respostas e corrija automaticamente</p>
        </div>
        <Button variant="gold" onClick={() => setShowNewExam(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nova Prova
        </Button>
      </div>

      {/* Action Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card hover onClick={startCamera}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Camera className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Escanear Provas</p>
              <p className="text-xs text-gray-500">Use a câmera do dispositivo</p>
            </div>
          </div>
        </Card>
        <Card hover onClick={() => fileInputRef.current?.click()}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Upload CSV</p>
              <p className="text-xs text-gray-500">Importe gabaritos em massa</p>
            </div>
          </div>
        </Card>
        <Card hover onClick={() => setShowNewExam(true)}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Criar Gabarito</p>
              <p className="text-xs text-gray-500">Monte sua prova questão a questão</p>
            </div>
          </div>
        </Card>
      </div>

      <input ref={fileInputRef} type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />

      {/* Scan Results */}
      {scanResults && (
        <Card className="mb-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Resultados da Correção
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Aluno</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">Nota</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {scanResults.map((r, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{r.student}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${r.score >= 7 ? 'text-green-600' : r.score >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {r.score}/{r.total}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.score >= 7 ? 'bg-green-100 text-green-700' :
                        r.score >= 5 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {r.score >= 7 ? 'Aprovado' : r.score >= 5 ? 'Recuperação' : 'Reprovado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Exams List */}
      {exams.length > 0 && (
        <Card>
          <h3 className="font-bold text-gray-800 mb-4">Provas Criadas</h3>
          <div className="space-y-3">
            {exams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">{exam.title}</p>
                  <p className="text-xs text-gray-500">{exam.subject} • {exam.questions.length} questões • {new Date(exam.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {exam.questions.reduce((acc, q) => acc + q.weight, 0)} pts
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* New Exam Modal */}
      <Modal isOpen={showNewExam} onClose={() => setShowNewExam(false)} title="Nova Prova" size="lg">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Título da Prova" placeholder="Ex: Prova de Matemática" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} />
            <Input label="Disciplina" placeholder="Ex: Matemática" value={examSubject} onChange={(e) => setExamSubject(e.target.value)} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Questões</label>
              <Button variant="ghost" size="sm" onClick={addQuestion}>
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {questions.map((q, idx) => (
                <div key={idx} className="flex items-end gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10">
                    <Input label="Nº" value={q.number} onChange={(e) => updateQuestion(idx, 'number', e.target.value)} />
                  </div>
                  <div className="w-16">
                    <Input label="Gabarito" value={q.answer} onChange={(e) => updateQuestion(idx, 'answer', e.target.value)} />
                  </div>
                  <div className="w-16">
                    <Input label="Peso" type="number" value={q.weight} onChange={(e) => updateQuestion(idx, 'weight', e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <Input label="BNCC" placeholder="Código BNCC" value={q.bncc} onChange={(e) => updateQuestion(idx, 'bncc', e.target.value)} />
                  </div>
                  {questions.length > 1 && (
                    <button onClick={() => removeQuestion(idx)} className="p-2 text-red-400 hover:text-red-600 mb-0.5">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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

      {/* Camera Modal */}
      <Modal isOpen={showCamera} onClose={stopCamera} title="Escanear Prova">
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-[4/3]">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            {!streamRef.current && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-12 h-12 text-white/50" />
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={stopCamera}>Cancelar</Button>
            <Button variant="gold" onClick={handleScan} loading={scanning} className="flex-1">
              {scanning ? 'Processando...' : 'Capturar e Corrigir'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
