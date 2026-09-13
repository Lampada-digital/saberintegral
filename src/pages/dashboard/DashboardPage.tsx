import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, TrendingUp, AlertTriangle, BookOpen, Award } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useStore } from '../../lib/store';
import { IAAnalyticsPreditivo } from '../../lib/ai';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { alunos, mensalidades, gabaritos, turmas } = useStore();

  const alunosAtivos = alunos.filter((a) => a.status === 'ativo').length;
  const mensPendentes = mensalidades.filter((m) => m.status === 'pendente' || m.status === 'atrasado');
  const valorPendente = mensPendentes.reduce((acc, m) => acc + m.valor, 0);
  const totalMensalidades = mensalidades.length;
  const taxaInadimplencia = totalMensalidades > 0 ? (mensPendentes.length / totalMensalidades) * 100 : 0;

  const todasNotas = gabaritos.flatMap((g) => g.notas.map((n) => n.nota));
  const mediaGeral = todasNotas.length > 0 ? todasNotas.reduce((a, b) => a + b, 0) / todasNotas.length : 0;

  const analytics = IAAnalyticsPreditivo(alunos, mensalidades, gabaritos);
  const alertasEvasao = analytics.riscoEvasao.filter((r) => r.risco > 50).slice(0, 3);
  const alertasInadimplencia = analytics.riscoInadimplencia.filter((r) => r.risco > 50).slice(0, 3);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Visão geral da sua escola</p>
      </div>

      {/* Métricas */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card hover onClick={() => navigate('/dashboard/alunos')}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Alunos Ativos</p>
              <p className="text-2xl font-bold text-gray-800">{alunosAtivos}</p>
            </div>
          </div>
        </Card>
        <Card hover onClick={() => navigate('/dashboard/financeiro')}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pendente</p>
              <p className="text-2xl font-bold text-gray-800">R$ {valorPendente.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Inadimplência</p>
              <p className="text-2xl font-bold text-gray-800">{taxaInadimplencia.toFixed(1)}%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Média Geral</p>
              <p className="text-2xl font-bold text-gray-800">{mediaGeral.toFixed(1)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Desempenho por Turma */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Desempenho por Turma
          </h3>
          <div className="space-y-4">
            {turmas.map((turma) => {
              const notasTurma = gabaritos.flatMap((g) => g.notas).filter((n) => alunos.find((a) => a.id === n.alunoId && a.turmaId === turma.id));
              const media = notasTurma.length > 0 ? notasTurma.reduce((a, b) => a + b.nota, 0) / notasTurma.length : 0;
              const percent = (media / 10) * 100;
              return (
                <div key={turma.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{turma.nome}</span>
                    <span className="text-gray-500">{media.toFixed(1)}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" /> Alertas da IA
          </h3>
          <div className="space-y-3">
            {alertasEvasao.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-red-600 mb-2">⚠️ Risco de Evasão</p>
                {alertasEvasao.map((a) => (
                  <div key={a.alunoId} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-700">{a.alunoNome}</span>
                    <span className="text-xs font-bold text-red-600">{a.risco}%</span>
                  </div>
                ))}
              </div>
            )}
            {alertasInadimplencia.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-yellow-600 mb-2">💰 Risco de Inadimplência</p>
                {alertasInadimplencia.map((a) => (
                  <div key={a.alunoId} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-700">{a.alunoNome}</span>
                    <span className="text-xs font-bold text-yellow-600">{a.risco}%</span>
                  </div>
                ))}
              </div>
            )}
            {alertasEvasao.length === 0 && alertasInadimplencia.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Nenhum alerta crítico no momento ✓</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
