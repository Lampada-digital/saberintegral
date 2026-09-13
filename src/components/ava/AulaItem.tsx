import React from 'react';
import { CheckCircle, PlayCircle, Lock, Clock, FileText, HelpCircle, Link as LinkIcon, Presentation } from 'lucide-react';
import type { Aula } from '../../lib/ava-store';
import { formatarTempo } from '../../lib/ia-ava';

interface AulaItemProps {
  aula: Aula;
  status: 'concluida' | 'atual' | 'bloqueada';
  onClick?: () => void;
  isActive?: boolean;
}

export const AulaItem: React.FC<AulaItemProps> = ({ aula, status, onClick, isActive }) => {
  const getIcon = () => {
    if (status === 'concluida') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'atual') return <PlayCircle className="w-5 h-5 text-primary" fill="currentColor" />;
    return <Lock className="w-5 h-5 text-gray-400" />;
  };

  const getTipoIcon = () => {
    switch (aula.tipo) {
      case 'video': return <PlayCircle className="w-3.5 h-3.5" />;
      case 'pdf': return <FileText className="w-3.5 h-3.5" />;
      case 'quiz': return <HelpCircle className="w-3.5 h-3.5" />;
      case 'link': return <LinkIcon className="w-3.5 h-3.5" />;
      case 'apresentacao': return <Presentation className="w-3.5 h-3.5" />;
      default: return <FileText className="w-3.5 h-3.5" />;
    }
  };

  const bgColor = isActive ? 'bg-primary/5 border-primary' : status === 'concluida' ? 'bg-green-50/50' : 'bg-white';
  const textColor = status === 'bloqueada' ? 'text-gray-400' : 'text-gray-800';

  return (
    <button
      onClick={status !== 'bloqueada' ? onClick : undefined}
      disabled={status === 'bloqueada'}
      className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left ${bgColor} ${
        status !== 'bloqueada' ? 'hover:shadow-sm cursor-pointer' : 'cursor-not-allowed opacity-60'
      } ${isActive ? 'border-primary border-2' : 'border-gray-200'}`}
    >
      <div className="shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium ${textColor} flex items-center gap-1`}>
            {getTipoIcon()}
            <span className="capitalize">{aula.tipo}</span>
          </span>
          {aula.duracao > 0 && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatarTempo(aula.duracao)}
            </span>
          )}
        </div>
        <p className={`text-sm font-medium ${textColor} truncate`}>{aula.titulo}</p>
      </div>
    </button>
  );
};
