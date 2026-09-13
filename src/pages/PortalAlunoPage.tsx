import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, DollarSign, FileText, Bell, Award, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useStore } from '../lib/store';

export const PortalAlunoPage: React.FC = () => {
  const navigate = useNavigate();
  const { alunos, turmas, gabaritos, mensalidades, materiaisAVA } = useStore();

  // Simular que o usuário logado é um aluno (para demo)
  const aluno = alunos[0]; // Pegar primeiro aluno como exemplo
  const turma = turmas.find((t) => t.id === aluno?.turmaId);

  // Dados do aluno
  const notasAluno = gabaritos.flatMap((g) => 
    g.notas.filter((n) => n.alunoId === aluno?.id).map((n) => ({ ...n, prova: g.titulo }))
  );
  const mensAluno = mensalidades.filter((m) => m.alunoId === aluno?.id);
  const materiaisTurma = materiaisAVA.filter((m) => m.turmaId === aluno?.turmaId);

  // Próximas atividades (simuladas)
  const proximasAtividades = [
    { titulo: 'Prova de Matemática', data: '2026-03-20', tipo: 'prova' },
    { titulo: 'Trabalho de Ciências', data: '2026-03-25', tipo: 'trabalho' },
    { titulo: 'Redação - Meio Ambiente', data: '2026-03-28', tipo: 'redacao' },
  ];

  // Avisos recentes
  const avisos = [
    { titulo: 'Reunião de Pais', data: '2026-03-15', descricao: 'Reunião presencial às 19h' },
    { titulo: 'Feira de Ciências', data: '2026-04-10', descricao: 'Inscrições abertas até 30/03' },
  ];

  if (!aluno) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center">
          <p className="text-gray-500 mb-4">Nenhum aluno encontrado</p>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Portal */}
      <header className="bg-primary text-white py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Portal do Aluno</h1>
              <p className="text-white/70 text-sm">Bem-vindo, {aluno.nome}</p>
            </div>
            <Button variant="gold" size="sm" onClick={() => navigate('/dashboard')}>
              Voltar ao Sistema
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Cards de Resumo */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card hover onClick={() => navigate('/dashboard/gabarito')}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Média Geral</p>
                <p className="text-2xl font-bold text-gray-800">
                  {notasAluno.length > 0 
                    ? (notasAluno.reduce((a, b) => a + b.nota, 0) / notasAluno.length).toFixed(1)
                    : '-'
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Materiais Disponíveis</p>
                <p className="text-2xl font-bold text-gray-800">{materiaisTurma.length}</p>
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pendências</p>
                <p className="text-2xl font-bold text-gray-800">
                  {mensAluno.filter((m) => m.status !== 'pago').length}
                </p>
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Turma</p>
                <p className="text-lg font-bold text-gray-800">{turma?.nome || '-'}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda */}
          <div className="lg:col-span-2 space-y-6">
            {/* Próximas Atividades */}
            <Card>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Próximas Atividades
              </h3>
              <div className="space-y-3">
                {proximasAtividades.map((atividade, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{atividade.titulo}</p>
                      <p className="text-xs text-gray-500 capitalize">{atividade.tipo}</p>
                    </div>
                    <span className="text-sm text-primary font-medium">
                      {new Date(atividade.data).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Notas Recentes */}
            <Card>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Notas Recentes
              </h3>
              {notasAluno.length > 0 ? (
                <div className="space-y-3">
                  {notasAluno.slice(0, 5).map((nota, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{nota.prova}</p>
                        <p className="text-xs text-gray-500">{nota.dataCorrecao}</p>
                      </div>
                      <span className={`text-lg font-bold ${
                        nota.nota >= 7 ? 'text-green-600' : nota.nota >= 5 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {nota.nota}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Nenhuma nota registrada</p>
              )}
            </Card>

            {/* Materiais AVA */}
            <Card>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Materiais da Turma
              </h3>
              {materiaisTurma.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {materiaisTurma.slice(0, 4).map((mat) => (
                    <div key={mat.id} className="p-3 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer">
                      <p className="font-medium text-gray-800 text-sm">{mat.titulo}</p>
                      <p className="text-xs text-gray-500 capitalize">{mat.tipo}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Nenhum material disponível</p>
              )}
            </Card>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* Avisos */}
            <Card>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" /> Avisos
              </h3>
              <div className="space-y-3">
                {avisos.map((aviso, i) => (
                  <div key={i} className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-gray-800 text-sm">{aviso.titulo}</p>
                    <p className="text-xs text-gray-600 mt-1">{aviso.descricao}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(aviso.data).toLocaleDateString('pt-BR')}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Financeiro */}
            <Card>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" /> Financeiro
              </h3>
              <div className="space-y-3">
                {mensAluno.slice(0, 3).map((mens) => (
                  <div key={mens.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(mens.vencimento).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-gray-500">R$ {mens.valor}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      mens.status === 'pago' ? 'bg-green-100 text-green-700' :
                      mens.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {mens.status}
                    </span>
                  </div>
                ))}
                {mensAluno.length > 0 && (
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Ver todas
                  </Button>
                )}
              </div>
            </Card>

            {/* Informações da Turma */}
            <Card>
              <h3 className="font-bold text-gray-800 mb-4">Minha Turma</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Turma:</span> <span className="font-medium">{turma?.nome}</span></p>
                <p><span className="text-gray-500">Série:</span> <span className="font-medium">{turma?.serie}</span></p>
                <p><span className="text-gray-500">Turno:</span> <span className="font-medium capitalize">{turma?.turno}</span></p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
