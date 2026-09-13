/**
 * 🤖 Motor de IA para AVA
 * 
 * Funções de IA aplicadas ao Ambiente Virtual de Aprendizagem:
 * - Transcrição de vídeo (simulada)
 * - Geração de resumos
 * - Geração automática de quizzes
 * - Detecção de engajamento
 * - Busca semântica
 */

import type { Aula, Trilha, ProgressoAluno } from './ava-store';

// ============ 4.1 IATranscreverVideo ============
export function IATranscreverVideo(aula: Aula): string {
  if (aula.transcricao) return aula.transcricao;

  // Simular transcrição baseada no título e descrição
  const titulo = aula.titulo.toLowerCase();
  
  const transcricoesSimuladas: Record<string, string> = {
    'frações': 'Nesta aula vamos aprender sobre frações. Uma fração representa uma parte de um todo. O numerador é o número de cima e indica quantas partes temos. O denominador é o número de baixo e indica em quantas partes o todo foi dividido. Vamos ver exemplos práticos do dia a dia.',
    'fotossíntese': 'A fotossíntese é o processo pelo qual as plantas produzem seu próprio alimento usando luz solar, água e gás carbônico. Este processo é fundamental para a vida na Terra, pois produz oxigênio e é a base da cadeia alimentar.',
    'redação': 'A redação do ENEM exige uma estrutura clara: introdução com tese, desenvolvimento com argumentos e proposta de intervenção. Vamos aprender técnicas para alcançar nota 1000.',
  };

  for (const [key, transcricao] of Object.entries(transcricoesSimuladas)) {
    if (titulo.includes(key)) return transcricao;
  }

  // Fallback: gerar transcrição genérica baseada no título
  return `Bem-vindos à aula sobre ${aula.titulo}. ${aula.descricao}. Neste conteúdo vamos explorar os principais conceitos de forma clara e objetiva, com exemplos práticos para facilitar o entendimento. Ao final, você terá uma compreensão sólida do tema.`;
}

// ============ 4.2 IAGerarResumo ============
export function IAGerarResumo(transcricao: string): string[] {
  if (!transcricao || transcricao.length < 50) {
    return ['Conteúdo muito curto para gerar resumo'];
  }

  const frases = transcricao.split(/[.!?]+/).filter((f) => f.trim().length > 10);
  
  // Extrair tópicos principais (primeiras palavras significativas de cada frase)
  const topicos: string[] = [];
  
  frases.forEach((frase) => {
    const palavras = frase.trim().split(/\s+/);
    if (palavras.length >= 3) {
      // Pegar os primeiros 5-7 palavras como resumo
      const resumo = palavras.slice(0, Math.min(7, palavras.length)).join(' ') + '...';
      topicos.push(resumo);
    }
  });

  // Limitar a 5 tópicos principais
  return topicos.slice(0, 5);
}

// ============ 4.3 IAGerarQuizAutomatico ============
export interface QuestaoGerada {
  enunciado: string;
  alternativas: string[];
  gabarito: number;
  bncc: string;
}

export function IAGerarQuizAutomatico(
  tituloAula: string,
  transcricao: string,
  quantidade: number = 5
): QuestaoGerada[] {
  const questoes: QuestaoGerada[] = [];
  const codigosBNCC = ['EF06MA01', 'EF06MA02', 'EF07LP01', 'EF08CI01', 'EF09HI01'];

  // Analisar palavras-chave da transcrição
  const palavrasChave = extrairPalavrasChave(transcricao);

  for (let i = 0; i < quantidade; i++) {
    const palavra = palavrasChave[i % palavrasChave.length] || 'conceito';
    
    // Gerar questão baseada na palavra-chave
    const questao: QuestaoGerada = {
      enunciado: `Sobre "${palavra}" no contexto de "${tituloAula}", assinale a alternativa CORRETA:`,
      alternativas: [
        `É um conceito fundamental que ${gerarComplemento(palavra, 'correto')}`,
        `Não tem relação com o tema estudado`,
        `Foi descartado pela ciência moderna`,
        `Aplica-se apenas a casos específicos e raros`,
        `É um conceito obsoleto e sem utilidade`,
      ],
      gabarito: 0,
      bncc: codigosBNCC[i % codigosBNCC.length],
    };
    
    // Embaralhar alternativas mantendo o gabarito correto
    const alternativasEmbaralhadas = embaralharAlternativas(questao.alternativas, 0);
    questao.alternativas = alternativasEmbaralhadas.alternativas;
    questao.gabarito = alternativasEmbaralhadas.novoIndiceCorreto;
    
    questoes.push(questao);
  }

  return questoes;
}

function extrairPalavrasChave(texto: string): string[] {
  const palavras = texto.toLowerCase().split(/\s+/);
  const stopWords = ['o', 'a', 'os', 'as', 'um', 'uma', 'de', 'da', 'do', 'em', 'no', 'na', 'para', 'com', 'que', 'e', 'é', 'por', 'se', 'não', 'ao', 'à'];
  
  const contagem: Record<string, number> = {};
  palavras.forEach((p) => {
    const palavraLimpa = p.replace(/[^\w]/g, '');
    if (palavraLimpa.length > 3 && !stopWords.includes(palavraLimpa)) {
      contagem[palavraLimpa] = (contagem[palavraLimpa] || 0) + 1;
    }
  });

  return Object.entries(contagem)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([palavra]) => palavra);
}

function gerarComplemento(palavra: string, tipo: 'correto' | 'errado'): string {
  if (tipo === 'correto') {
    const complementos = [
      'possui características essenciais para o entendimento do tema',
      'é amplamente estudado e reconhecido na área',
      'tem aplicação prática em diversos contextos',
      'foi consolidado por pesquisas científicas recentes',
    ];
    return complementos[Math.floor(Math.random() * complementos.length)];
  }
  return 'não possui relevância para o tema';
}

function embaralharAlternativas(alternativas: string[], indiceCorreto: number) {
  const indices = alternativas.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  const novasAlternativas = indices.map((i) => alternativas[i]);
  const novoIndiceCorreto = indices.indexOf(indiceCorreto);
  
  return { alternativas: novasAlternativas, novoIndiceCorreto };
}

// ============ 4.4 IADetectarEngajamento ============
export interface AnaliseEngajamento {
  risco: 'alto' | 'medio' | 'baixo';
  score: number;
  sugestao: string;
  fatores: string[];
}

export function IADetectarEngajamento(
  progresso: ProgressoAluno | undefined,
  trilha: Trilha
): AnaliseEngajamento {
  if (!progresso) {
    return {
      risco: 'alto',
      score: 0,
      sugestao: 'Aluno ainda não iniciou a trilha. Enviar lembrete motivacional.',
      fatores: ['Nenhuma atividade realizada'],
    };
  }

  const totalAulas = trilha.modulos.reduce((acc, m) => acc + m.aulas.length, 0);
  const aulasConcluidas = progresso.aulasConcluidas.length;
  const percentualConclusao = (aulasConcluidas / totalAulas) * 100;
  
  // Calcular dias desde última atividade
  const diasInativo = progresso.ultimaAula
    ? Math.floor((Date.now() - new Date(progresso.dataInicio).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const fatores: string[] = [];
  let score = 100;

  // Análise de conclusão
  if (percentualConclusao < 20) {
    score -= 40;
    fatores.push(`Baixo progresso: ${percentualConclusao.toFixed(0)}%`);
  } else if (percentualConclusao < 50) {
    score -= 20;
    fatores.push(`Progresso moderado: ${percentualConclusao.toFixed(0)}%`);
  } else if (percentualConclusao >= 80) {
    fatores.push(`Excelente progresso: ${percentualConclusao.toFixed(0)}%`);
  }

  // Análise de tempo de estudo
  const tempoMedioPorAula = progresso.tempoTotalEstudo / Math.max(1, aulasConcluidas);
  if (tempoMedioPorAula < 300) {
    score -= 20;
    fatores.push('Tempo de estudo por aula abaixo do esperado');
  } else if (tempoMedioPorAula > 600) {
    fatores.push('Dedicação acima da média');
  }

  // Análise de inatividade
  if (diasInativo > 7) {
    score -= 30;
    fatores.push(`${diasInativo} dias sem atividade`);
  } else if (diasInativo > 3) {
    score -= 10;
    fatores.push(`${diasInativo} dias sem atividade`);
  }

  score = Math.max(0, Math.min(100, score));

  let risco: 'alto' | 'medio' | 'baixo';
  let sugestao: string;

  if (score >= 70) {
    risco = 'baixo';
    sugestao = 'Aluno engajado. Continuar com conteúdo desafiador.';
  } else if (score >= 40) {
    risco = 'medio';
    sugestao = 'Enviar mensagem motivacional e sugerir revisão dos conteúdos.';
  } else {
    risco = 'alto';
    sugestao = 'Contatar aluno e responsável. Oferecer suporte personalizado.';
  }

  return { risco, score, sugestao, fatores };
}

// ============ 4.5 IABuscaSemantica ============
export interface ResultadoBusca {
  trilhaId: string;
  trilhaNome: string;
  moduloId: string;
  moduloNome: string;
  aulaId: string;
  aulaTitulo: string;
  relevancia: number;
  trecho: string;
  timestamp?: number;
}

export function IABuscaSemantica(query: string, trilhas: Trilha[]): ResultadoBusca[] {
  const resultados: ResultadoBusca[] = [];
  const queryLower = query.toLowerCase();
  const termosBusca = queryLower.split(/\s+/).filter((t) => t.length > 2);

  trilhas.forEach((trilha) => {
    trilha.modulos.forEach((modulo) => {
      modulo.aulas.forEach((aula) => {
        let relevancia = 0;
        let trecho = '';

        // Buscar no título
        if (aula.titulo.toLowerCase().includes(queryLower)) {
          relevancia += 100;
          trecho = aula.titulo;
        }

        // Buscar na descrição
        if (aula.descricao.toLowerCase().includes(queryLower)) {
          relevancia += 50;
          trecho = aula.descricao;
        }

          // Buscar na transcrição
        if (aula.transcricao) {
          const transcricaoLower = aula.transcricao.toLowerCase();
          const idx = transcricaoLower.indexOf(queryLower);
          if (idx !== -1) {
            relevancia += 75;
            // Extrair trecho ao redor da ocorrência
            const transcricao = aula.transcricao;
            const inicio = Math.max(0, idx - 50);
            const fim = Math.min(transcricao.length, idx + queryLower.length + 50);
            trecho = '...' + transcricao.slice(inicio, fim) + '...';            
            // Estimar timestamp baseado na posição
            const posicaoPercentual = idx / aula.transcricao.length;
            const timestamp = Math.floor(aula.duracao * posicaoPercentual);
            
            resultados.push({
              trilhaId: trilha.id,
              trilhaNome: trilha.nome,
              moduloId: modulo.id,
              moduloNome: modulo.nome,
              aulaId: aula.id,
              aulaTitulo: aula.titulo,
              relevancia,
              trecho,
              timestamp,
            });
            return;
          }

          // Busca por termos individuais
          const transcricaoOriginal = aula.transcricao;
          termosBusca.forEach((termo) => {
            if (transcricaoLower.includes(termo)) {
              relevancia += 10;
              if (!trecho && transcricaoOriginal) {
                const idx = transcricaoLower.indexOf(termo);
                const inicio = Math.max(0, idx - 30);
                const fim = Math.min(transcricaoOriginal.length, idx + termo.length + 30);
                trecho = '...' + transcricaoOriginal.slice(inicio, fim) + '...';
              }
            }
          });
        }

        // Buscar nos materiais
        if (aula.materiais) {
          aula.materiais.forEach((mat) => {
            if (mat.nome.toLowerCase().includes(queryLower)) {
              relevancia += 30;
              trecho = mat.nome;
            }
          });
        }

        if (relevancia > 0) {
          resultados.push({
            trilhaId: trilha.id,
            trilhaNome: trilha.nome,
            moduloId: modulo.id,
            moduloNome: modulo.nome,
            aulaId: aula.id,
            aulaTitulo: aula.titulo,
            relevancia,
            trecho: trecho || aula.descricao,
          });
        }
      });
    });
  });

  return resultados.sort((a, b) => b.relevancia - a.relevancia).slice(0, 20);
}

// ============ FUNÇÕES AUXILIARES ============

export function formatarTempo(segundos: number): string {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segs = Math.floor(segundos % 60);

  if (horas > 0) {
    return `${horas}h ${minutos}min`;
  }
  if (minutos > 0) {
    return `${minutos}min ${segs}s`;
  }
  return `${segs}s`;
}

export function calcularProgressoTrilha(progresso: ProgressoAluno | undefined, trilha: Trilha): number {
  if (!progresso) return 0;
  const totalAulas = trilha.modulos.reduce((acc, m) => acc + m.aulas.length, 0);
  if (totalAulas === 0) return 0;
  return Math.round((progresso.aulasConcluidas.length / totalAulas) * 100);
}

export function encontrarProximaAula(progresso: ProgressoAluno | undefined, trilha: Trilha): Aula | null {
  if (!progresso) {
    // Retornar primeira aula da trilha
    const primeiroModulo = trilha.modulos.sort((a, b) => a.ordem - b.ordem)[0];
    if (!primeiroModulo) return null;
    const primeiraAula = primeiroModulo.aulas.sort((a, b) => a.ordem - b.ordem)[0];
    return primeiraAula || null;
  }

  // Encontrar próxima aula não concluída
  const modulosOrdenados = [...trilha.modulos].sort((a, b) => a.ordem - b.ordem);
  for (const modulo of modulosOrdenados) {
    const aulasOrdenadas = [...modulo.aulas].sort((a, b) => a.ordem - b.ordem);
    for (const aula of aulasOrdenadas) {
      if (!progresso.aulasConcluidas.includes(aula.id)) {
        return aula;
      }
    }
  }

  return null; // Trilha concluída
}
