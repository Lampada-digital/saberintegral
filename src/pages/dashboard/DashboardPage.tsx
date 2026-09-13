import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, TrendingUp, AlertTriangle, BookOpen, Award, School, UserCheck, Calendar, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useStore } from '../../lib/store';
import { IAAnaliseAvancada, IAPreverFluxoCaixa } from '../../lib/ai-avancada';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { alunos, turmas, professores, mensalidades, gabaritos, materiaisAVA } = useStore();

  // Métricas principais
  const alunosAtivos = alunos.filter((a) => a.status === 'ativo').length;
  const totalProfessores = professores.length;
  const totalTurmas = turmas.length;
  
  const mensalidadeMedia = mensalidades.length > 0 
    ? mensalidades.reduce((acc, m) => acc + m.valor, 0) / mensalidades.length 
    : 850;
  const receitaMes = alunosAtivos * mensalidadeMedia * 0.85; // 85% adimplência
  const mensPendentes = mensalidades.filter((m) => m.status === 'pendente' || m.status === 'atrasado');
  const valorPendente = mensPendentes.reduce((acc, m) => acc + m.valor, 0);
  const totalMensalidades = mensalidades.length;
  const taxaInadimplencia = totalMensalidades > 0 ? (mensPendentes.length / totalMensalidades) * 100 : 0;

  const todasNotas = gabaritos.flatMap((g) => g.notas.map((n) => n.nota));
  const mediaGeral = todasNotas.length > 0 ? todasNotas.reduce((a, b) => a + b, 0) / todasNotas.length : 0;
  const totalMateriais = materiaisAVA.length;

  // Análise avançada
  const analytics = IAAnaliseAvancada(alunos, mensalidades, gabaritos);
  const previsao = IAPreverFluxoCaixa(mensalidades, 3);
  
  const alertasEvasao = analytics.riscoEvasao.filter((r) => r.risco > 50).slice(0, 5);
  const alertasInadimplencia = analytics.riscoInadimplencia.filter((r) => r.risco > 50).slice(0, 5);
  const alunosBaixoDesempenho = analytics.riscoEvasao
    .filter((r) => {
      const notasAluno = gabaritos.flatMap((g) => g.notas.filter((n) => n.alunoId === r.alunoId));
      if (notasAluno.length === 0) return false;
      const media = notasAluno.reduce((a, b) => a + b.nota, 0) / notasAluno.length;
      return media < 5;
    })
    .slice(0, 5);

  // Atividades recentes (simuladas)
  const atividadesRecentes = [
    { icon: Users, text: 'Maria Silva Santos matriculada no 6º Ano A', time: 'há 2 horas', color: 'text-blue-600 bg-blue-50' },
    { icon: DollarSign, text: 'Pagamento recebido de João Pedro Oliveira', time: 'há 5 horas', color: 'text-green-600 bg-green-50' },
    { icon: Award, text: 'Nota lançada: Prova de Matemática - 6º Ano A', time: 'há 1 dia', color: 'text-purple-600 bg-purple-50' },
    { icon: BookOpen, text: 'Novo material publicado: Introdução à Álgebra', time: 'há 2 dias', color: 'text-orange-600 bg-orange-50' },
    { icon: Calendar, text: 'Reunião de pais agendada para 15/03', time: 'há 3 dias', color: 'text-pink-600 bg-pink-50' },
  ];

  // Próximos eventos
  const proximosEventos = [
    { tipo: 'prova', titulo: 'Prova de Português - 7º Ano B', data: '2026-03-20', icon: BookOpen },
    { tipo: 'reuniao', titulo: 'Reunião de Pais - 6º Ano A', data: '2026-03-15', icon: Calendar },
    { tipo: 'vencimento', titulo: 'Vencimento mensalidades', data: '2026-03-10', icon: DollarSign },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Visão geral completa da sua escola</p>
      </div>

      {/* 8 Cards de Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover onClick={() => navigate('/dashboard/alunos')}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Alunos Ativos</p>
              <p className="text-2xl font-bold text-gray-800">{alunosAtivos}</p>
              <p className="text-xs text-green-600">+12% este mês</p>
            </div>
          </div>
        </Card>

        <Card hover onClick={() => navigate('/dashboard/professores')}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <UserCheck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Professores</p>
              <p className="text-2xl font-bold text-gray-800">{totalProfessores}</p>
              <p className="text-xs text-gray-400">Ativos</p>
            </div>
          </div>
        </Card>

        <Card hover onClick={() => navigate('/dashboard/turmas')}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <School className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Turmas Ativas</p>
              <p className="text-2xl font-bold text-gray-800">{totalTurmas}</p>
              <p className="text-xs text-gray-400">Este ano</p>
            </div>
          </div>
        </Card>

        <Card hover onClick={() => navigate('/dashboard/financeiro')}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Receita do Mês</p>
              <p className="text-2xl font-bold text-green-600">R$ {Math.round(receitaMes).toLocaleString('pt-BR')}</p>
              <p className="text-xs text-green-600">Previsto</p>
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
              <p className="text-2xl font-bold text-yellow-600">R$ {valorPendente.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-yellow-600">{mensPendentes.length} boleto(s)</p>
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
              <p className="text-2xl font-bold text-red-600">{taxaInadimplencia.toFixed(1)}%</p>
              <p className="text-xs text-gray-400">Meta: {'<'}10%</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Média Geral</p>
              <p className="text-2xl font-bold text-emerald-600">{mediaGeral.toFixed(1)}</p>
              <p className="text-xs text-gray-400">de 10</p>
            </div>
          </div>
        </Card>

        <Card hover onClick={() => navigate('/dashboard/ava')}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Materiais AVA</p>
              <p className="text-2xl font-bold text-gray-800">{totalMateriais}</p>
              <p className="text-xs text-gray-400">Publicados</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfico de Desempenho por Turma */}
      <Card>
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Desempenho por Turma
        </h3>
        <div className="space-y-4">
          {turmas.map((turma) => {
            const notasTurma = gabaritos.flatMap((g) => g.notas).filter((n) => alunos.find((a) => a.id === n.alunoId && a.turmaId === turma.id));
            const media = notasTurma.length > 0 ? notasTurma.reduce((a, b) => a + b.nota, 0) / notasTurma.length : 0;
            const percent = (media / 10) * 100;
            const cor = media >= 7 ? 'bg-green-500' : media >= 5 ? 'bg-yellow-500' : 'bg-red-500';
            
            return (
              <div key={turma.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{turma.nome}</span>
                  <span className="text-gray-500">{media.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`${cor} h-3 rounded-full transition-all`} style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Grid: Alertas IA + Previsão Fluxo de Caixa */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Painel Inteligente IA */}
        <Card>
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" /> Painel Inteligente (IA)
          </h3>
          
          <div className="space-y-4">
            {/* Sugestões da IA */}
            <div>
              <p className="text-xs font-semibold text-primary mb-2">💡 Sugestões da IA</p>
              <div className="space-y-2">
                {analytics.sugestoesIA.map((sug, i) => (
                  <div key={i} className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                    {sug}
                  </div>
                ))}
              </div>
            </div>

            {/* Risco de Evasão */}
            {alertasEvasao.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-red-600 mb-2">⚠️ Risco de Evasão</p>
                <div className="space-y-2">
                  {alertasEvasao.map((a) => (
                    <div key={a.alunoId} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex-1">
                        <span className="text-sm text-gray-700">{a.alunoNome}</span>
                        <p className="text-xs text-gray-500">{a.acaoSugerida}</p>
                      </div>
                      <span className="text-xs font-bold text-red-600 ml-2">{a.risco}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risco de Inadimplência */}
            {alertasInadimplencia.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-orange-600 mb-2">💰 Risco de Inadimplência</p>
                <div className="space-y-2">
                  {alertasInadimplencia.map((a) => (
                    <div key={a.alunoId} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex-1">
                        <span className="text-sm text-gray-700">{a.alunoNome}</span>
                        <p className="text-xs text-gray-500">{a.acaoSugerida}</p>
                      </div>
                      <span className="text-xs font-bold text-orange-600 ml-2">{a.risco}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Baixo Desempenho */}
            {alunosBaixoDesempenho.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-purple-600 mb-2">📚 Baixo Desempenho</p>
                <div className="space-y-2">
                  {alunosBaixoDesempenho.map((a) => (
                    <div key={a.alunoId} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-700">{a.alunoNome}</span>
                      <span className="text-xs text-purple-600">Reforço necessário</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Previsão de Fluxo de Caixa */}
        <Card>
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" /> Previsão de Fluxo de Caixa
          </h3>
          <div className="space-y-4">
            {previsao.meses.map((mes, i) => (
              <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">{mes.mes}</span>
                  <span className="text-xs text-gray-400">{mes.confianca}% confiança</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">Receita</p>
                    <p className="font-semibold text-green-600">R$ {mes.receitaPrevista.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Despesas</p>
                    <p className="font-semibold text-red-600">R$ {mes.despesaPrevista.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Lucro</p>
                    <p className={`font-semibold ${mes.lucroPrevisto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {mes.lucroPrevisto.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Grid: Atividades Recentes + Próximos Eventos */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Atividades Recentes */}
        <Card>
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Atividades Recentes
          </h3>
          <div className="space-y-3">
            {atividadesRecentes.map((atividade, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${atividade.color}`}>
                  <atividade.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{atividade.text}</p>
                  <p className="text-xs text-gray-400">{atividade.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Próximos Eventos */}
        <Card>
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Próximos Eventos
          </h3>
          <div className="space-y-3">
            {proximosEventos.map((evento, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg">
                  <evento.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{evento.titulo}</p>
                  <p className="text-xs text-gray-500">{new Date(evento.data).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
