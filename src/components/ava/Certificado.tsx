import React from 'react';
import { Award, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { useStore } from '../../lib/store';
import type { Trilha, ProgressoAluno } from '../../lib/ava-store';

interface CertificadoProps {
  trilha: Trilha;
  progresso: ProgressoAluno;
  alunoNome: string;
}

export const Certificado: React.FC<CertificadoProps> = ({ trilha, progresso, alunoNome }) => {
  const { schoolConfig } = useStore();
  const dataConclusao = progresso.dataConclusao
    ? new Date(progresso.dataConclusao).toLocaleDateString('pt-BR')
    : new Date().toLocaleDateString('pt-BR');

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="bg-white">
      {/* Certificado visual */}
      <div
        id="certificado"
        className="relative bg-gradient-to-br from-white via-gray-50 to-white border-8 rounded-lg p-12 mx-auto max-w-3xl"
        style={{ borderColor: schoolConfig.corPrimaria || '#1E3A5F' }}
      >
        {/* Decoração de cantos */}
        <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4" style={{ borderColor: schoolConfig.corSecundaria || '#C59D2C' }} />
        <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4" style={{ borderColor: schoolConfig.corSecundaria || '#C59D2C' }} />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4" style={{ borderColor: schoolConfig.corSecundaria || '#C59D2C' }} />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4" style={{ borderColor: schoolConfig.corSecundaria || '#C59D2C' }} />

        <div className="text-center space-y-6">
          {/* Logo da escola */}
          <div className="flex justify-center">
            {schoolConfig.logo ? (
              <img src={schoolConfig.logo} alt={schoolConfig.nomeEscola} className="h-16 object-contain" />
            ) : (
              <Award className="w-16 h-16 text-gold" />
            )}
          </div>

          {/* Nome da escola */}
          <div>
            <h2 className="text-2xl font-bold" style={{ color: schoolConfig.corPrimaria || '#1E3A5F' }}>
              {schoolConfig.nomeEscola || 'Escola'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Certificado de Conclusão</p>
          </div>

          {/* Texto principal */}
          <div className="py-6 border-y border-gray-200">
            <p className="text-gray-600 mb-2">Certificamos que</p>
            <h1 className="text-4xl font-bold text-primary mb-2">{alunoNome}</h1>
            <p className="text-gray-600 mb-4">concluiu com aproveitamento a trilha de aprendizagem</p>
            <h3 className="text-2xl font-semibold" style={{ color: trilha.cor || '#1E3A5F' }}>
              {trilha.nome}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Disciplina: {trilha.disciplina} • Nível: {trilha.nivel}
            </p>
          </div>

          {/* Detalhes */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Data de Conclusão</p>
              <p className="font-semibold text-gray-800">{dataConclusao}</p>
            </div>
            <div>
              <p className="text-gray-500">Carga Horária</p>
              <p className="font-semibold text-gray-800">{Math.round(progresso.tempoTotalEstudo / 60)}h</p>
            </div>
            <div>
              <p className="text-gray-500">Código</p>
              <p className="font-semibold text-gray-800 font-mono text-xs">{progresso.id.slice(0, 12)}</p>
            </div>
          </div>

          {/* Assinatura */}
          <div className="pt-6">
            <div className="inline-block">
              <div className="w-48 border-t-2 border-gray-400 pt-2">
                <p className="text-xs text-gray-500">Direção Pedagógica</p>
                <p className="text-sm font-semibold text-gray-800">{schoolConfig.nomeEscola || 'Escola'}</p>
              </div>
            </div>
          </div>

          {/* QR Code simulado */}
          <div className="flex justify-end">
            <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center border border-gray-300">
              <div className="grid grid-cols-4 gap-0.5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de download (fora da área de impressão) */}
      <div className="text-center mt-6 print:hidden">
        <Button variant="gold" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" /> Baixar Certificado (PDF)
        </Button>
      </div>

      {/* Estilos de impressão */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificado, #certificado * { visibility: visible; }
          #certificado { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
};
