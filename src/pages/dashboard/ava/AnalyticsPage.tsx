import React from 'react';
import { BarChart3, Users, Clock, TrendingUp, Award } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { useAVAStore } from '../../../lib/ava-store';
import { useStore } from '../../../lib/store';
import { ProgressBar } from '../../../components/ava/ProgressBar';

export const AnalyticsPage: React.FC = () => {
  const { trilhas, progressos } = useAVAStore();
  const { alunos } = useStore();

  // Calcular métricas
  const totalAlunos = alunos.filter((a) => a.status === 'ativo').length;
  const totalTrilhas = trilhas.length;
  
  // Taxa de conclusão por trilha
  const conclusaoPorTrilha = trilhas.map((trilha) => {
    const progressosTrilha = progressos.filter((p) => p.trilhaId === trilha.id);
    const concluidos = progressosTrilha.filter((p) => p.progresso === 100).length;
    const taxaConclusao = progressosTrilha.length > 0 ? (concluidos / progressosTrilha.length) * 100 : 0;
    return { trilha, taxaConclusao, total: progressosTrilha.length };
  });

  // Tempo médio de estudo
  const tempoMedio = progressos.length > 0
    ? progressos.reduce((acc, p) => acc + p.tempoTotalEstudo, 0) / progressos.length
    : 0;

  // Alunos inativos (sem progresso há mais de 7 dias)
  const alunosInativos = alunos.filter((aluno) => {
    const progresso = progressos.find((p) => p.alunoId === aluno.id);
    if (!progresso) return true;
    const diasInativo = (Date.now() - new Date(progresso.dataInicio).getTime()) / (1000 * 60 * 60 * 24);
    return diasInativo > 7;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Analytics do AVA</h1>
        <p className="text-sm text-gray-500">Acompanhe o desempenho e engajamento dos alunos</p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Alunos Ativos</p>
              <p className="text-2xl font-bold text-gray-800">{totalAlunos}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Trilhas Ativas</p>
              <p className="text-2xl font-bold text-gray-800">{totalTrilhas}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Tempo Médio</p>
              <p className="text-2xl font-bold text-gray-800">{Math.round(tempoMedio / 60)}min</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Alunos Inativos</p>
              <p className="text-2xl font-bold text-gray-800">{alunosInativos.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Taxa de Conclusão por Trilha */}
      <Card>
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Taxa de Conclusão por Trilha
        </h3>
        <div className="space-y-4">
          {conclusaoPorTrilha.map(({ trilha, taxaConclusao, total }) => (
            <div key={trilha.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{trilha.nome}</span>
                <span className="text-gray-500">{total} aluno{total !== 1 ? 's' : ''} • {taxaConclusao.toFixed(0)}%</span>
              </div>
              <ProgressBar progress={taxaConclusao} color={trilha.cor} size="md" showLabel={false} />
            </div>
          ))}
          {conclusaoPorTrilha.length === 0 && (
            <p className="text-center text-gray-400 py-8">Nenhuma trilha com progresso</p>
          )}
        </div>
      </Card>

      {/* Alunos Inativos */}
      {alunosInativos.length > 0 && (
        <Card>
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" /> Alunos Inativos (+7 dias)
          </h3>
          <div className="space-y-2">
            {alunosInativos.slice(0, 10).map((aluno) => (
              <div key={aluno.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-gray-800">{aluno.nome}</span>
                <span className="text-xs text-orange-600">Inativo</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
