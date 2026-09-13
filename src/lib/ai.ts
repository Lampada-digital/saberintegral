import type { FeedbackIA, Aluno, Mensalidade, GabaritoProva } from './store';

// ============ MOTOR DE IA AVANÇADA ============

// Lista de erros gramaticais comuns
const ERROS_GRAMATICAIS: { erro: RegExp; correcao: string; explicacao: string }[] = [
  { erro: /\bmenas\b/gi, correcao: 'menos', explicacao: '"Menas" não existe. Use "menos" (invariável).' },
  { erro: /\bhouveram\b/gi, correcao: 'houve', explicacao: 'Verbo "haver" no sentido de existir é impessoal.' },
  { erro: /\bfazem\s+(\d+)\s+(anos|meses|dias)\b/gi, correcao: 'faz $1 $2', explicacao: 'Verbo "fazer" indicando tempo é impessoal.' },
  { erro: /\bmeio\s+dia\b/gi, correcao: 'meio-dia', explicacao: 'Use hífen em "meio-dia".' },
  { erro: /\bpor\s+que\s+([^?])/gi, correcao: 'por que / porque', explicacao: 'Verifique o uso de "por que", "porque", "por quê" ou "porquê".' },
  { erro: /\bseje\b/gi, correcao: 'seja', explicacao: '"Seje" não existe. Use "seja".' },
  { erro: /\bpriviléggio\b/gi, correcao: 'privilégio', explicacao: 'A grafia correta é "privilégio".' },
  { erro: /\bexcessão\b/gi, correcao: 'exceção', explicacao: 'A grafia correta é "exceção".' },
  { erro: /\bconcerteza\b/gi, correcao: 'com certeza', explicacao: 'Escreve-se separado: "com certeza".' },
  { erro: /\bde\s+menor\b/gi, correcao: 'menor de idade', explicacao: 'Use "menor de idade".' },
  { erro: /\bentrou\s+em\s+concacto\b/gi, correcao: 'entrou em contato', explicacao: 'A grafia correta é "contato".' },
  { erro: /\bprevilégio\b/gi, correcao: 'privilégio', explicacao: 'A grafia correta é "privilégio".' },
  { erro: /\bmim\s+fazer\b/gi, correcao: 'eu fazer', explicacao: '"Mim" não conjuga verbo. Use "eu".' },
  { erro: /\bpara\s+mim\s+\w+r\b/gi, correcao: 'para eu + verbo', explicacao: 'Quando há verbo, use "para eu".' },
  { erro: /\bha\s+ver\b/gi, correcao: 'a ver', explicacao: 'Use "a ver" (sem h).' },
  { erro: /\bem\s+baixo\b/gi, correcao: 'embaixo', explicacao: '"Embaixo" é uma palavra só quando indica posição.' },
];

// Conectivos importantes
const CONECTIVOS = [
  'portanto', 'contudo', 'entretanto', 'ademais', 'além disso', 'por conseguinte',
  'dessa forma', 'assim', 'logo', 'pois', 'todavia', 'não obstante', 'outrossim',
  'por outro lado', 'em contrapartida', 'conforme', 'segundo', 'consoante',
  'uma vez que', 'visto que', 'dado que', 'já que', 'porque', 'porquanto',
  'embora', 'ainda que', 'mesmo que', 'conquanto', 'posto que', 'se bem que',
];

// Códigos BNCC aleatórios
const CODIGOS_BNCC = [
  'EF06MA01', 'EF06MA02', 'EF06MA03', 'EF06MA04', 'EF06MA05',
  'EF06MA06', 'EF06MA07', 'EF06MA08', 'EF06MA09', 'EF06MA10',
  'EF07LP01', 'EF07LP02', 'EF07LP03', 'EF07LP04', 'EF07LP05',
  'EF08CI01', 'EF08CI02', 'EF08CI03', 'EF09HI01', 'EF09HI02',
];

// ============ IA CORRIGIR REDAÇÃO ============
export function IACorrigirRedacao(texto: string): FeedbackIA {
  const pontosFortes: string[] = [];
  const pontosMelhorar: string[] = [];
  const errosGramaticais: string[] = [];
  let nota = 600; // Base

  // 1. Análise de tamanho
  const tamanho = texto.length;
  const palavras = texto.split(/\s+/).filter((p) => p.length > 0).length;
  
  if (tamanho < 500) {
    pontosMelhorar.push(`Texto muito curto (${tamanho} caracteres). O mínimo recomendado é 500 caracteres.`);
    nota -= 200;
  } else if (tamanho >= 500 && tamanho < 1000) {
    pontosMelhorar.push('Texto com tamanho adequado, mas pode ser mais desenvolvido.');
    nota += 50;
  } else if (tamanho >= 1000 && tamanho < 2000) {
    pontosFortes.push('Texto com tamanho adequado e bem desenvolvido.');
    nota += 150;
  } else if (tamanho >= 2000) {
    pontosFortes.push('Texto extenso e bem elaborado.');
    nota += 200;
  }

  // 2. Análise de parágrafos (estrutura)
  const paragrafos = texto.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  
  if (paragrafos.length < 3) {
    pontosMelhorar.push('Estruture o texto em pelo menos 3 parágrafos: introdução, desenvolvimento e conclusão.');
    nota -= 100;
  } else if (paragrafos.length === 3) {
    pontosFortes.push('Boa estrutura com introdução, desenvolvimento e conclusão.');
    nota += 100;
  } else if (paragrafos.length >= 4) {
    pontosFortes.push('Excelente estrutura com múltiplos parágrafos de desenvolvimento.');
    nota += 150;
  }

  // 3. Erros gramaticais
  ERROS_GRAMATICAIS.forEach(({ erro, correcao, explicacao }) => {
    const matches = texto.match(erro);
    if (matches) {
      errosGramaticais.push(`${explicacao} (encontrado: "${matches[0]}" → use "${correcao}")`);
      nota -= 30 * matches.length;
    }
  });

  if (errosGramaticais.length === 0) {
    pontosFortes.push('Nenhum erro gramatical comum detectado.');
    nota += 50;
  } else if (errosGramaticais.length <= 2) {
    pontosMelhorar.push('Poucos erros gramaticais. Revise com atenção.');
  } else {
    pontosMelhorar.push('Diversos erros gramaticais identificados. Revise o texto com mais cuidado.');
  }

  // 4. Repetição de palavras
  const palavrasTexto = texto.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter((p) => p.length > 3);
  const contagem: Record<string, number> = {};
  palavrasTexto.forEach((p) => {
    contagem[p] = (contagem[p] || 0) + 1;
  });
  
  const repeticoes = Object.entries(contagem).filter(([, count]) => count > 3);
  if (repeticoes.length > 0) {
    pontosMelhorar.push(`Palavras repetidas excessivamente: ${repeticoes.map(([p]) => `"${p}"`).join(', ')}. Use sinônimos.`);
    nota -= 20 * repeticoes.length;
  } else {
    pontosFortes.push('Bom vocabulário, sem repetições excessivas.');
    nota += 30;
  }

  // 5. Conectivos
  const textoLower = texto.toLowerCase();
  const conectivosUsados = CONECTIVOS.filter((c) => textoLower.includes(c));
  
  if (conectivosUsados.length === 0) {
    pontosMelhorar.push('Use conectivos para articular melhor as ideias (ex: portanto, contudo, além disso).');
    nota -= 80;
  } else if (conectivosUsados.length < 3) {
    pontosMelhorar.push('Poucos conectivos utilizados. Enriqueça o texto com mais articulação.');
    nota += 20;
  } else if (conectivosUsados.length >= 5) {
    pontosFortes.push(`Excelente uso de conectivos: ${conectivosUsados.slice(0, 5).join(', ')}.`);
    nota += 80;
  } else {
    pontosFortes.push('Bom uso de conectivos para articular as ideias.');
    nota += 50;
  }

  // 6. Pontuação
  const pontosFinal = (texto.match(/\./g) || []).length;
  const virgulas = (texto.match(/,/g) || []).length;
  
  if (pontosFinal === 0) {
    pontosMelhorar.push('O texto não contém pontos finais. Use pontuação adequadamente.');
    nota -= 50;
  } else if (pontosFinal >= 5) {
    pontosFortes.push('Bom uso de pontuação.');
    nota += 30;
  }

  if (virgulas === 0 && palavras > 30) {
    pontosMelhorar.push('Use vírgulas para separar orações e enumerar itens.');
    nota -= 30;
  }

  // 7. Letra maiúscula no início
  const frases = texto.split(/[.!?]+/).filter((f) => f.trim().length > 0);
  const frasesSemMaiuscula = frases.filter((f) => {
    const trimmed = f.trim();
    return trimmed.length > 0 && trimmed[0] === trimmed[0].toLowerCase() && /[a-z]/.test(trimmed[0]);
  });
  
  if (frasesSemMaiuscula.length > 0) {
    pontosMelhorar.push(`${frasesSemMaiuscula.length} frase(s) sem letra maiúscula no início.`);
    nota -= 20;
  }

  // Normalizar nota para 0-1000
  nota = Math.max(0, Math.min(1000, nota));

  // Feedback geral
  let feedback = '';
  if (nota >= 800) {
    feedback = 'Excelente redação! Você demonstrou domínio da norma culta, boa estrutura argumentativa e uso adequado de conectivos. Continue assim!';
  } else if (nota >= 600) {
    feedback = 'Boa redação! Há pontos positivos, mas alguns aspectos precisam ser melhorados. Revise os pontos destacados abaixo.';
  } else if (nota >= 400) {
    feedback = 'Redação regular. É necessário desenvolver melhor a argumentação, revisar a estrutura e atentar para aspectos gramaticais.';
  } else {
    feedback = 'Redação precisa de melhorias significativas. Recomenda-se revisar a estrutura textual, desenvolver melhor os argumentos e atentar para a norma culta.';
  }

  return {
    nota: Math.round(nota),
    feedback,
    pontosFortes: pontosFortes.length > 0 ? pontosFortes : ['Continue praticando!'],
    pontosMelhorar: pontosMelhorar.length > 0 ? pontosMelhorar : ['Mantenha o bom trabalho!'],
    errosGramaticais,
  };
}

// ============ IA GERAR QUESTÕES ============
export interface QuestaoGerada {
  numero: number;
  enunciado: string;
  alternativas: { letra: string; texto: string }[];
  gabarito: string;
  peso: number;
  bncc: string;
}

export function IAGerarQuestoes(tema: string, quantidade: number, dificuldade: 'facil' | 'medio' | 'dificil'): QuestaoGerada[] {
  const questoes: QuestaoGerada[] = [];
  const letras = ['A', 'B', 'C', 'D', 'E'];
  
  const modelosEnunciado = {
    facil: [
      `Sobre o tema "${tema}", assinale a alternativa CORRETA:`,
      `Qual das opções abaixo melhor define "${tema}"?`,
      `Em relação a "${tema}", é correto afirmar:`,
    ],
    medio: [
      `Analise as afirmativas sobre "${tema}" e assinale a correta:`,
      `Considerando os conceitos de "${tema}", marque a alternativa adequada:`,
      `No contexto de "${tema}", identifique a proposição verdadeira:`,
    ],
    dificil: [
      `Acerca das implicações de "${tema}", assinale a alternativa que apresenta análise mais completa:`,
      `Tendo em vista as perspectivas teóricas sobre "${tema}", selecione a correta:`,
      `Na perspectiva crítica sobre "${tema}", a alternativa que melhor sintetiza o conceito é:`,
    ],
  };

  const alternativasBase = {
    facil: [
      'É um conceito simples e direto, sem complexidade.',
      'Refere-se apenas a aspectos superficiais do tema.',
      'Apresenta a definição mais aceita e consolidada.',
      'Não possui relação com outros conceitos.',
      'É irrelevante para o estudo atual.',
    ],
    medio: [
      'Apresenta uma visão reducionista do tema.',
      'Considera apenas um aspecto isolado.',
      'Integra diferentes perspectivas de análise.',
      'Ignora o contexto histórico do tema.',
      'Limita-se a definições ultrapassadas.',
    ],
    dificil: [
      'Simplifica excessivamente as relações complexas do tema.',
      'Desconsidera as nuances e particularidades conceituais.',
      'Articula múltiplas dimensões de forma coerente e crítica.',
      'Apresenta uma visão unilateral e dogmática.',
      'Baseia-se em premissas não fundamentadas teoricamente.',
    ],
  };

  for (let i = 0; i < quantidade; i++) {
    const enunciados = modelosEnunciado[dificuldade];
    const alts = alternativasBase[dificuldade];
    const gabaritoIdx = Math.floor(Math.random() * 5);
    
    // Embaralhar alternativas
    const alternativasEmbaralhadas = [...alts].sort(() => Math.random() - 0.5);
    const novaGabaritoIdx = alternativasEmbaralhadas.indexOf(alts[gabaritoIdx]);
    
    questoes.push({
      numero: i + 1,
      enunciado: enunciados[i % enunciados.length],
      alternativas: letras.map((letra, idx) => ({
        letra,
        texto: alternativasEmbaralhadas[idx],
      })),
      gabarito: letras[novaGabaritoIdx],
      peso: dificuldade === 'facil' ? 1 : dificuldade === 'medio' ? 2 : 3,
      bncc: CODIGOS_BNCC[Math.floor(Math.random() * CODIGOS_BNCC.length)],
    });
  }

  return questoes;
}

// ============ IA ANALYTICS PREDITIVO ============
export interface AnalyticsPreditivo {
  riscoEvasao: { alunoId: string; alunoNome: string; risco: number; fatores: string[] }[];
  riscoInadimplencia: { alunoId: string; alunoNome: string; risco: number; fatores: string[] }[];
  desempenhoTurma: { turmaId: string; turmaNome: string; media: number; totalAlunos: number }[];
}

export function IAAnalyticsPreditivo(
  alunos: Aluno[],
  mensalidades: Mensalidade[],
  gabaritos: GabaritoProva[]
): AnalyticsPreditivo {
  // Risco de evasão
  const riscoEvasao = alunos.map((aluno) => {
    const fatores: string[] = [];
    let risco = 20; // Base

    // Notas baixas aumentam risco
    const notasAluno = gabaritos.flatMap((g) => g.notas.filter((n) => n.alunoId === aluno.id));
    if (notasAluno.length > 0) {
      const mediaNotas = notasAluno.reduce((acc, n) => acc + n.nota, 0) / notasAluno.length;
      if (mediaNotas < 5) {
        risco += 40;
        fatores.push(`Média de notas baixa (${mediaNotas.toFixed(1)})`);
      } else if (mediaNotas < 7) {
        risco += 15;
        fatores.push('Média de notas regular');
      }
    } else {
      risco += 10;
      fatores.push('Sem notas registradas');
    }

    // Inadimplência aumenta risco
    const mensAluno = mensalidades.filter((m) => m.alunoId === aluno.id);
    const atrasadas = mensAluno.filter((m) => m.status === 'atrasado').length;
    if (atrasadas > 0) {
      risco += 30 * atrasadas;
      fatores.push(`${atrasadas} mensalidade(s) atrasada(s)`);
    }

    // Status inativo
    if (aluno.status === 'inativo') {
      risco += 50;
      fatores.push('Aluno inativo');
    }

    return {
      alunoId: aluno.id,
      alunoNome: aluno.nome,
      risco: Math.min(100, risco),
      fatores,
    };
  }).sort((a, b) => b.risco - a.risco);

  // Risco de inadimplência
  const riscoInadimplencia = alunos.map((aluno) => {
    const fatores: string[] = [];
    let risco = 15;

    const mensAluno = mensalidades.filter((m) => m.alunoId === aluno.id);
    const atrasadas = mensAluno.filter((m) => m.status === 'atrasado').length;
    const pendentes = mensAluno.filter((m) => m.status === 'pendente').length;

    if (atrasadas > 0) {
      risco += 40 * atrasadas;
      fatores.push(`Histórico de ${atrasadas} atraso(s)`);
    }
    if (pendentes > 0) {
      risco += 20 * pendentes;
      fatores.push(`${pendentes} mensalidade(s) pendente(s)`);
    }

    // Notas baixas correlacionam com inadimplência
    const notasAluno = gabaritos.flatMap((g) => g.notas.filter((n) => n.alunoId === aluno.id));
    if (notasAluno.length > 0) {
      const mediaNotas = notasAluno.reduce((acc, n) => acc + n.nota, 0) / notasAluno.length;
      if (mediaNotas < 5) {
        risco += 20;
        fatores.push('Desempenho acadêmico baixo');
      }
    }

    return {
      alunoId: aluno.id,
      alunoNome: aluno.nome,
      risco: Math.min(100, risco),
      fatores,
    };
  }).sort((a, b) => b.risco - a.risco);

  // Desempenho por turma
  const turmasMap = new Map<string, { notas: number[]; nome: string }>();
  
  alunos.forEach((aluno) => {
    if (!turmasMap.has(aluno.turmaId)) {
      turmasMap.set(aluno.turmaId, { notas: [], nome: '' });
    }
    const notasAluno = gabaritos.flatMap((g) => g.notas.filter((n) => n.alunoId === aluno.id));
    notasAluno.forEach((n) => turmasMap.get(aluno.turmaId)!.notas.push(n.nota));
  });

  const desempenhoTurma = Array.from(turmasMap.entries()).map(([turmaId, data]) => ({
    turmaId,
    turmaNome: data.nome || turmaId,
    media: data.notas.length > 0 ? data.notas.reduce((a, b) => a + b, 0) / data.notas.length : 0,
    totalAlunos: alunos.filter((a) => a.turmaId === turmaId).length,
  }));

  return { riscoEvasao, riscoInadimplencia, desempenhoTurma };
}
