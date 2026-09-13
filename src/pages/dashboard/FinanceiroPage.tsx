import React, { useState } from 'react';
import { DollarSign, TrendingUp, AlertCircle, Plus, Check, Download, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/Modal';
import { Table } from '../../components/Table';
import { useStore, useToastStore } from '../../lib/store';
import { useEventBus } from '../../lib/eventBus';
import { IAAnaliseAvancada, IAPreverFluxoCaixa, IASugerirReajuste } from '../../lib/ai-avancada';

export const FinanceiroPage: React.FC = () => {
  const { alunos, turmas, mensalidades, updateMensalidade, gerarMensalidades } = useStore();
  const { addToast } = useToastStore();
  const { emit } = useEventBus();
  const [tab, setTab] = useState<'dashboard' | 'mensalidades' | 'gerar' | 'relatorios'>('dashboard');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterTurma, setFilterTurma] = useState<string>('');
  const [confirmPayId, setConfirmPayId] = useState<string | null>(null);
  const [mesGerar, setMesGerar] = useState(new Date().toISOString().slice(0, 7));
  const [turmasSelecionadas, setTurmasSelecionadas] = useState<string[]>([]);

  const analytics = IAAnaliseAvancada(alunos, mensalidades, []);
  const previsao = IAPreverFluxoCaixa(mensalidades, 6);
  const riscoInadimplencia = analytics.riscoInadimplencia.filter((r) => r.risco > 40).slice(0, 10);
  
  const reajuste = IASugerirReajuste(850);

  // Métricas
  const totalRecebido = mensalidades.filter((m) => m.status === 'pago').reduce((a, m) => a + m.valor, 0);
  const totalPendente = mensalidades.filter((m) => m.status === 'pendente').reduce((a, m) => a + m.valor, 0);
  const totalAtrasado = mensalidades.filter((m) => m.status === 'atrasado').reduce((a, m) => a + m.valor, 0);
  const totalGeral = totalRecebido + totalPendente + totalAtrasado;
  const taxaInadimplencia = totalGeral > 0 ? ((totalPendente + totalAtrasado) / totalGeral) * 100 : 0;
  const ticketMedio = mensalidades.length > 0 ? totalGeral / mensalidades.length : 0;

  const filtered = mensalidades.filter((m) => {
    const matchStatus = !filterStatus || m.status === filterStatus;
    const matchTurma = !filterTurma || alunos.find((a) => a.id === m.alunoId)?.turmaId === filterTurma;
    return matchStatus && matchTurma;
  });

  const handleMarcarPago = async (id: string) => {
    const mensalidade = mensalidades.find((m) => m.id === id);
    updateMensalidade(id, { status: 'pago' });
    addToast('Mensalidade marcada como paga!', 'success');
    setConfirmPayId(null);
    
    // Emitir evento de mensalidade paga (notifica pais com recibo)
    await emit('mensalidade_paga', {
      entityId: mensalidade?.alunoId || id,
      entityName: mensalidade?.alunoNome,
      data: {
        mensalidadeId: id,
        valor: mensalidade?.valor,
        vencimento: mensalidade?.vencimento,
      },
      priority: 'normal',
    });
  };

  const handleGerar = async () => {
    if (turmasSelecionadas.length === 0) {
      addToast('Selecione pelo menos uma turma', 'error');
      return;
    }
    gerarMensalidades(mesGerar);
    addToast(`${turmasSelecionadas.length} turma(s) - Mensalidades geradas com sucesso!`, 'success');
    setTab('mensalidades');
    setTurmasSelecionadas([]);
    
    // Emitir eventos para cada mensalidade gerada
    const alunosTurmas = alunos.filter((a) => turmasSelecionadas.includes(a.turmaId) && a.status === 'ativo');
    for (const aluno of alunosTurmas) {
      await emit('mensalidade_gerada', {
        entityId: aluno.id,
        entityName: aluno.nome,
        data: {
          valor: 850,
          vencimento: `${mesGerar}-10`,
          turmaId: aluno.turmaId,
        },
        priority: 'normal',
      });
    }
  };

  const handleExportRelatorio = () => {
    addToast('Relatório exportado com sucesso!', 'success');
  };

  const statusBadge = (status: string) => {
    const classes = {
      pago: 'bg-green-100 text-green-700',
      pendente: 'bg-yellow-100 text-yellow-700',
      atrasado: 'bg-red-100 text-red-700',
    };
    return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${classes[status as keyof typeof classes]}`}>{status}</span>;
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Financeiro</h1>
        <p className="text-sm text-gray-500">Gestão financeira completa com IA</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { key: 'dashboard', label: 'Dashboard' },
          { key: 'mensalidades', label: 'Mensalidades' },
          { key: 'gerar', label: 'Gerar Mensalidades' },
          { key: 'relatorios', label: 'Relatórios' },
        ].map((t) => (
          <button 
            key={t.key} 
            onClick={() => setTab(t.key as any)} 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              tab === t.key ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard Financeiro */}
      {tab === 'dashboard' && (
        <div className="space-y-6">
          {/* Cards de Métricas */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg"><DollarSign className="w-5 h-5 text-green-600" /></div>
                <div>
                  <p className="text-xs text-gray-500">Receita Total</p>
                  <p className="text-xl font-bold text-green-600">R$ {totalRecebido.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-50 rounded-lg"><DollarSign className="w-5 h-5 text-yellow-600" /></div>
                <div>
                  <p className="text-xs text-gray-500">Pendente</p>
                  <p className="text-xl font-bold text-yellow-600">R$ {totalPendente.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg"><AlertCircle className="w-5 h-5 text-red-600" /></div>
                <div>
                  <p className="text-xs text-gray-500">Atrasado</p>
                  <p className="text-xl font-bold text-red-600">R$ {totalAtrasado.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg"><TrendingUp className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <p className="text-xs text-gray-500">Inadimplência</p>
                  <p className="text-xl font-bold text-blue-600">{taxaInadimplencia.toFixed(1)}%</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg"><DollarSign className="w-5 h-5 text-purple-600" /></div>
                <div>
                  <p className="text-xs text-gray-500">Ticket Médio</p>
                  <p className="text-xl font-bold text-purple-600">R$ {ticketMedio.toFixed(0)}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg"><FileText className="w-5 h-5 text-indigo-600" /></div>
                <div>
                  <p className="text-xs text-gray-500">Total de Boletos</p>
                  <p className="text-xl font-bold text-gray-800">{mensalidades.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Previsão de Fluxo de Caixa */}
          <Card>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" /> Previsão de Fluxo de Caixa (Próximos 6 meses)
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

          {/* Sugestão de Reajuste */}
          <Card>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" /> Sugestão de Reajuste (IA)
            </h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="grid sm:grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Valor Atual</p>
                  <p className="text-lg font-bold text-gray-800">R$ {reajuste.valorAtual}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Valor Sugerido</p>
                  <p className="text-lg font-bold text-green-600">R$ {reajuste.valorSugerido}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reajuste</p>
                  <p className="text-lg font-bold text-primary">+{reajuste.percentualReajuste}%</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{reajuste.justificativa}</p>
            </div>
          </Card>

          {/* Alertas de Inadimplência */}
          {riscoInadimplencia.length > 0 && (
            <Card>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" /> Alertas de Inadimplência (IA)
              </h3>
              <div className="space-y-3">
                {riscoInadimplencia.map((r) => (
                  <div key={r.alunoId} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{r.alunoNome}</p>
                      <p className="text-xs text-gray-500">{r.fatores.join(', ')}</p>
                      <p className="text-xs text-orange-600 mt-1">💡 {r.acaoSugerida}</p>
                    </div>
                    <span className={`text-sm font-bold ml-4 ${r.risco > 70 ? 'text-red-600' : 'text-orange-600'}`}>{r.risco}%</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Mensalidades */}
      {tab === 'mensalidades' && (
        <div className="space-y-4">
          <Card>
            <div className="flex flex-col sm:flex-row gap-3">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm">
                <option value="">Todos os status</option>
                <option value="pago">Pago</option>
                <option value="pendente">Pendente</option>
                <option value="atrasado">Atrasado</option>
              </select>
              <select value={filterTurma} onChange={(e) => setFilterTurma(e.target.value)} className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm">
                <option value="">Todas as turmas</option>
                {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
              <Button variant="outline" onClick={handleExportRelatorio} className="sm:ml-auto">
                <Download className="w-4 h-4 mr-2" /> Exportar
              </Button>
            </div>
          </Card>
          <Card padding={false}>
            <Table
              columns={[
                { key: 'alunoNome', header: 'Aluno', render: (m) => <span className="font-medium text-gray-800">{m.alunoNome}</span> },
                { key: 'valor', header: 'Valor', render: (m) => `R$ ${m.valor.toLocaleString('pt-BR')}` },
                { key: 'vencimento', header: 'Vencimento', render: (m) => new Date(m.vencimento).toLocaleDateString('pt-BR') },
                { key: 'status', header: 'Status', render: (m) => statusBadge(m.status) },
                { key: 'acao', header: 'Ação', render: (m) => m.status !== 'pago' ? (
                  <Button variant="ghost" size="sm" onClick={() => setConfirmPayId(m.id)}><Check className="w-4 h-4 mr-1" /> Pagar</Button>
                ) : <span className="text-xs text-green-600">✓ Pago</span> },
              ]}
              data={filtered}
              keyExtractor={(m) => m.id}
            />
          </Card>
        </div>
      )}

      {/* Gerar Mensalidades */}
      {tab === 'gerar' && (
        <Card>
          <h3 className="font-bold text-gray-800 mb-4">Gerar Mensalidades em Lote</h3>
          <p className="text-sm text-gray-500 mb-6">Selecione o mês e as turmas para gerar mensalidades automaticamente.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mês de Referência</label>
              <input type="month" value={mesGerar} onChange={(e) => setMesGerar(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Turmas</label>
              <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {turmas.map((t) => (
                  <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={turmasSelecionadas.includes(t.id)} 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTurmasSelecionadas([...turmasSelecionadas, t.id]);
                        } else {
                          setTurmasSelecionadas(turmasSelecionadas.filter(id => id !== t.id));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">{t.nome}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Preview:</strong> Serão geradas mensalidades para {turmasSelecionadas.length} turma(s) no valor padrão de R$ 850,00.
              </p>
            </div>

            <Button variant="gold" onClick={handleGerar} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Gerar Mensalidades
            </Button>
          </div>
        </Card>
      )}

      {/* Relatórios */}
      {tab === 'relatorios' && (
        <div className="space-y-4">
          <Card>
            <h3 className="font-bold text-gray-800 mb-4">Relatórios Disponíveis</h3>
            <div className="space-y-3">
              <Button variant="outline" onClick={handleExportRelatorio} className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" /> Relatório de Inadimplência
              </Button>
              <Button variant="outline" onClick={handleExportRelatorio} className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" /> Relatório de Recebimentos
              </Button>
              <Button variant="outline" onClick={handleExportRelatorio} className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" /> DRE Simplificado
              </Button>
              <Button variant="outline" onClick={handleExportRelatorio} className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" /> Fluxo de Caixa Projetado
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de Confirmação de Pagamento */}
      <Modal isOpen={!!confirmPayId} onClose={() => setConfirmPayId(null)} title="Confirmar Pagamento" size="sm">
        <p className="text-gray-600 mb-6">Confirmar que esta mensalidade foi paga?</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setConfirmPayId(null)}>Cancelar</Button>
          <Button variant="gold" onClick={() => confirmPayId && handleMarcarPago(confirmPayId)} className="flex-1">Confirmar Pagamento</Button>
        </div>
      </Modal>
    </div>
  );
};
