import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, BookOpen, Settings, BarChart3 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { TrilhaCard } from '../../../components/ava/TrilhaCard';
import { useAVAStore } from '../../../lib/ava-store';
import { useStore } from '../../../lib/store';

export const AvaDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { trilhas, progressos } = useAVAStore();
  const { turmas } = useStore();
  const [search, setSearch] = useState('');
  const [filterTurma, setFilterTurma] = useState('');

  const filtered = trilhas.filter((t) => {
    const matchSearch = t.nome.toLowerCase().includes(search.toLowerCase()) || t.disciplina.toLowerCase().includes(search.toLowerCase());
    const matchTurma = !filterTurma || t.turmaId === filterTurma;
    return matchSearch && matchTurma;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">AVA - Ambiente Virtual</h1>
          <p className="text-sm text-gray-500">{trilhas.length} trilha(s) criada(s)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/dashboard/ava/analytics')}>
            <BarChart3 className="w-4 h-4 mr-2" /> Analytics
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard/ava/estudio')}>
            <Settings className="w-4 h-4 mr-2" /> Estúdio
          </Button>
          <Button variant="gold" onClick={() => navigate('/dashboard/ava/estudio')}>
            <Plus className="w-4 h-4 mr-2" /> Nova Trilha
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar trilhas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select value={filterTurma} onChange={(e) => setFilterTurma(e.target.value)} className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm">
            <option value="">Todas as turmas</option>
            {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
        </div>
      </Card>

      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((trilha) => {
            const progresso = progressos.find((p) => p.trilhaId === trilha.id && p.alunoId === 'a1');
            return <TrilhaCard key={trilha.id} trilha={trilha} progresso={progresso} />;
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Nenhuma trilha encontrada</p>
          <Button variant="gold" onClick={() => navigate('/dashboard/ava/estudio')}>
            <Plus className="w-4 h-4 mr-2" /> Criar Primeira Trilha
          </Button>
        </Card>
      )}
    </div>
  );
};
