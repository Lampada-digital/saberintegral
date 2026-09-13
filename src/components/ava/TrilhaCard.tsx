import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Award, Clock } from 'lucide-react';
import type { Trilha, ProgressoAluno } from '../../lib/ava-store';
import { ProgressBar } from './ProgressBar';
import { calcularProgressoTrilha, encontrarProximaAula } from '../../lib/ia-ava';

interface TrilhaCardProps {
  trilha: Trilha;
  progresso?: ProgressoAluno;
  showProgress?: boolean;
}

export const TrilhaCard: React.FC<TrilhaCardProps> = ({ trilha, progresso, showProgress = true }) => {
  const navigate = useNavigate();
  const percentual = calcularProgressoTrilha(progresso, trilha);
  const proximaAula = encontrarProximaAula(progresso, trilha);
  const totalAulas = trilha.modulos.reduce((acc, m) => acc + m.aulas.length, 0);
  const aulasConcluidas = progresso?.aulasConcluidas.length || 0;

  const nivelColors = {
    Iniciante: 'bg-green-100 text-green-700',
    Intermediário: 'bg-yellow-100 text-yellow-700',
    Avançado: 'bg-red-100 text-red-700',
  };

  return (
    <div
      onClick={() => navigate(`/portal/ava/trilha/${trilha.id}`)}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      {/* Thumbnail */}
      <div
        className="h-32 relative overflow-hidden"
        style={{ backgroundColor: trilha.cor || '#1E3A5F' }}
      >
        {trilha.thumbnail ? (
          <img src={trilha.thumbnail} alt={trilha.nome} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white/30" />
          </div>
        )}
        
        {/* Overlay com nível */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${nivelColors[trilha.nivel]}`}>
            {trilha.nivel}
          </span>
        </div>

        {/* Overlay com certificado */}
        {trilha.certificado && (
          <div className="absolute top-3 right-3">
            <div className="bg-white/90 p-1.5 rounded-full">
              <Award className="w-4 h-4 text-gold" />
            </div>
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="bg-white/90 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-6 h-6 text-primary" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
            {trilha.disciplina}
          </span>
          <span className="text-xs text-gray-400">
            {trilha.modulos.length} módulo{trilha.modulos.length !== 1 ? 's' : ''}
          </span>
        </div>

        <h3 className="font-bold text-gray-800 mb-1 line-clamp-2">{trilha.nome}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{trilha.descricao}</p>

        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> {aulasConcluidas}/{totalAulas} aulas
          </span>
          {progresso?.tempoTotalEstudo && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {Math.round(progresso.tempoTotalEstudo / 60)}min
            </span>
          )}
        </div>

        {showProgress && (
          <div>
            <ProgressBar progress={percentual} color={trilha.cor} size="sm" />
            {proximaAula && percentual < 100 && (
              <p className="text-xs text-gray-500 mt-2 truncate">
                Próxima: <span className="font-medium">{proximaAula.titulo}</span>
              </p>
            )}
            {percentual === 100 && (
              <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">
                <Award className="w-3 h-3" /> Trilha concluída!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
