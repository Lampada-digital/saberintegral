import React, { useState } from 'react';
import { DollarSign, Check, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/Modal';
import { Table } from '../../components/Table';
import { useStore, useToastStore } from '../../lib/store';
import { IAAnalyticsPreditivo } from '../../lib/ai';

export const FinanceiroPage: React.FC = () => {
  const { alunos, mensalidades, updateMensalidade, gerarMensalidades } = useStore();
  const { addToast } = useToastStore();
  const [tab, setTab] = useState<'mensalidades' | 'gerar' | 'relatorios'>('mensalidades');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [confirmPayId, setConfirmPayId] = useState<string | null>(null);
  const [mesGerar, setMesGerar] = useState(new Date().toISOString().slice(0, 7));

  const analytics = IAAnalyticsPreditivo(alunos, mensalidades, []);
  const riscoInadimplencia = analytics.riscoInadimplencia.filter((r) => r.risco > 40).slice(0, 5);

  const totalRecebido = mensalidades.filter((m) => m.status === 'pago').reduce((a, m) => a + m.valor, 0);
  const totalPendente = mensalidades.filter((m) => m.status === 'pendente').reduce((a, m) => a + m.valor, 0);
  const totalAtrasado = mensalidades.filter((m) => m.status === 'atrasado').reduce((a, m) => a + m.valor, 0);

  const filtered = filterStatus ? mensalidades.filter((m) => m.status === filterStatus) : mensalidades;

  const handleMarcarPago = (id: string) => {
    updateMensalidade(id, { status: 'pago' });
    addToast('Mensalidade marcada como paga!', 'success');
    setConfirmPayId(null);
  };

  const handleGerar = () => {
    gerarMensalidades(mesGerar);
    addToast('Mensalidades geradas com sucesso!', 'success');
    setTab('mensalidades');
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
        <p className="text-sm text-gray-500">Gerencie mensalidades e acompanhe o faturamento</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg"><DollarSign className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Recebido</p>
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
            <div className="p-2 bg-red-50 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Atrasado</p>
              <p className="text-xl font-bold text-red-600">R$ {totalAtrasado.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['mensalidades', 'gerar', 'relatorios'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
            {t === 'mensalidades' ? 'Mensalidades' : t === 'gerar' ? 'Gerar Mensalidades' : 'Relatórios'}
          </button>
        ))}
      </div>

      {tab === 'mensalidades' && (
        <>
          <Card className="mb-4">
            <div className="flex gap-2">
              {['', 'pago', 'pendente', 'atrasado'].map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filterStatus === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {s || 'Todos'}
                </button>
              ))}
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
        </>
      )}

      {tab === 'gerar' && (
        <Card>
          <h3 className="font-bold text-gray-800 mb-4">Gerar Mensalidades do Mês</h3>
          <p className="text-sm text-gray-500 mb-4">Serão criadas mensalidades para todos os alunos ativos.</p>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mês de Referência</label>
              <input type="month" value={mesGerar} onChange={(e) => setMesGerar(e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <Button variant="gold" onClick={handleGerar}><Plus className="w-4 h-4 mr-2" /> Gerar</Button>
          </div>
        </Card>
      )}

      {tab === 'relatorios' && (
        <Card>
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" /> Alertas de Inadimplência (IA)
          </h3>
          <p className="text-sm text-gray-500 mb-4">Alunos com maior risco de inadimplência identificados pela IA.</p>
          {riscoInadimplencia.length > 0 ? (
            <div className="space-y-3">
              {riscoInadimplencia.map((r) => (
                <div key={r.alunoId} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{r.alunoNome}</p>
                    <p className="text-xs text-gray-500">{r.fatores.join(', ')}</p>
                  </div>
                  <span className={`text-sm font-bold ${r.risco > 70 ? 'text-red-600' : 'text-yellow-600'}`}>{r.risco}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Nenhum aluno com risco significativo de inadimplência ✓</p>
          )}
        </Card>
      )}

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
