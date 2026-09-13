import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Award, PlayCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { TrilhaCard } from '../../components/ava/TrilhaCard';
import { useAVAStore } from '../../lib/ava-store';
import { useStore } from '../../lib/store';
import { encontrarProximaAula, formatarTempo } from '../../lib/ia-ava';

export const PortalAVAPage: React.FC = () => {
  const navigate = useNavigate();
  const { trilhas, progressos, conquistas } = useAVAStore();
  const { alunos } = useStore();

  // Simular aluno logado (primeiro aluno ativo)
  const aluno = alunos.find((a) => a.status === 'ativo') || alunos[0];
  if (!aluno) return <div className="p-8 text-center text-gray-500">Nenhum aluno encontrado</div>;

  const progressosAluno = progressos.filter((p) => p.alunoId === aluno.id);
  const trilhasAluno = trilhas.filter((t) => progressosAluno.some((p) => p.trilhaId === t.id));

  // Continue de onde parou
  const ultimaAtividade = progressosAluno
    .filter((p) => p.ultimaAula)
    .sort((a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime())[0];

  let continueCard = null;
  if (ultimaAtividade) {
    const trilha = trilhas.find((t) => t.id === ultimaAtividade.trilhaId);
    const proximaAula = encontrarProximaAula(ultimaAtividade, trilha!);
    if (trilha && proximaAula) {
      continueCard = { trilha, aula: proximaAula, progresso: ultimaAtividade };
    }
  }

  // Conquistas do aluno
  const todasConquistas = progressosAluno.flatMap((p) => p.conquistas);
  const conquistasUnicas = [...new Set(todasConquistas)];
  const conquistasDesbloqueadas = conquistas.filter((c) => conquistasUnicas.includes(c.id));

  // Tempo total de estudo
  const tempoTotal = progressosAluno.reduce((acc, p) => acc + p.tempoTotalEstudo, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Minhas Trilhas</h1>
              <p className="text-white/70 text-sm">Olá, {aluno.nome}! Continue aprendendo.</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="text-sm text-white/70 hover:text-white">
              Voltar ao Sistema
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
        {/* Continue de onde parou */}
        {continueCard && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-primary" /> Continue de onde parou
            </h2>
            <Card hover onClick={() => navigate(`/portal/ava/aula/${continueCard.aula.id}?trilha=${continueCard.trilha.id}`)} className="!p-0 overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-64 h-32 sm:h-auto relative" style={{ backgroundColor: continueCard.trilha.cor }}>
                  {continueCard.trilha.thumbnail ? (
                    <img src={continueCard.trilha.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4">
                  <p className="text-xs text-primary font-medium mb-1">{continueCard.trilha.disciplina}</p>
                  <h3 className="font-bold text-gray-800 mb-1">{continueCard.aula.titulo}</h3>
                  <p className="text-sm text-gray-500 mb-3">{continueCard.trilha.nome}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatarTempo(continueCard.aula.duracao)}
                    </span>
                    <span className="text-sm font-semibold text-primary">Continuar →</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Stats rápidas */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{trilhasAluno.length}</p>
              <p className="text-xs text-gray-500">Trilhas</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{formatarTempo(tempoTotal)}</p>
              <p className="text-xs text-gray-500">Tempo de Estudo</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{conquistasDesbloqueadas.length}</p>
              <p className="text-xs text-gray-500">Conquistas</p>
            </div>
          </Card>
        </div>

        {/* Minhas Trilhas */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Minhas Trilhas
          </h2>
          {trilhasAluno.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trilhasAluno.map((trilha) => {
                const progresso = progressosAluno.find((p) => p.trilhaId === trilha.id);
                return <TrilhaCard key={trilha.id} trilha={trilha} progresso={progresso} />;
              })}
            </div>
          ) : (
            <Card className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Você ainda não está matriculado em nenhuma trilha</p>
            </Card>
          )}
        </div>

        {/* Conquistas */}
        {conquistasDesbloqueadas.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold" /> Minhas Conquistas
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {conquistasDesbloqueadas.map((conquista) => (
                <Card key={conquista.id} className="text-center !p-4">
                  <div className="text-4xl mb-2">{conquista.icone}</div>
                  <p className="text-sm font-semibold text-gray-800">{conquista.nome}</p>
                  <p className="text-xs text-gray-500 mt-1">{conquista.descricao}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
