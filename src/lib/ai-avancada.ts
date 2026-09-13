// Motor de IA Avançada para SABER INTEGRAL

import type { Aluno, Mensalidade, GabaritoProva, MaterialAVA } from './store';

// ============ ANÁLISE PREDITIVA AVANÇADA ============

export interface AnalisePreditiva {
  riscoEvasao: Array<{
    alunoId: string;
    alunoNome: string;
    risco: number;
    fatores: string[];
    acaoSugerida: string;
  }>;
  riscoInadimplencia: Array<{
    alunoId: string;
    alunoNome: string;
    risco: number;
    fatores: string[];
    acaoSugerida: string;
  }>;
  desempenhoTurma: Array<{
    turmaId: string;
    turmaNome: string;
    media: number;
    totalAlunos: number;
    tendencia: 'melhorando' | 'estavel' | 'piorando';
  }>;
  sugestoesIA: string[];
}

export function IAAnaliseAvancada(
  alunos: Aluno[],
  mensalidades: Mensalidade[],
  gabaritos: GabaritoProva[]
): AnalisePreditiva {
  const sugestoesIA: string[] = [];

  // Risco de Evasão
  const riscoEvasao = alunos.map((aluno) => {
    const fatores: string[] = [];
    let risco = 15;

    // Análise de notas
    const notasAluno = gabaritos.flatMap((g) => g.notas.filter((n) => n.alunoId === aluno.id));
    if (notasAluno.length > 0) {
      const mediaNotas = notasAluno.reduce((acc, n) => acc + n.nota, 0) / notasAluno.length;
      if (mediaNotas < 5) {
        risco += 45;
        fatores.push(`Média muito baixa (${mediaNotas.toFixed(1)})`);
      } else if (mediaNotas < 7) {
        risco += 20;
        fatores.push('Média regular');
      }
      
      // Tendência de notas
      if (notasAluno.length >= 2) {
        const ultimas = notasAluno.slice(-2);
        if (ultimas[1].nota < ultimas[0].nota - 1) {
          risco += 15;
          fatores.push('Notas em declínio');
        }
      }
    } else {
      risco += 10;
      fatores.push('Sem notas registradas');
    }

    // Inadimplência
    const mensAluno = mensalidades.filter((m) => m.alunoId === aluno.id);
    const atrasadas = mensAluno.filter((m) => m.status === 'atrasado').length;
    if (atrasadas > 0) {
      risco += 35 * atrasadas;
      fatores.push(`${atrasadas} mensalidade(s) atrasada(s)`);
    }

    // Status
    if (aluno.status === 'inativo') {
      risco += 60;
      fatores.push('Aluno inativo');
    }

    // Frequência (simulada)
    const frequenciaBaixa = Math.random() < 0.2;
    if (frequenciaBaixa) {
      risco += 25;
      fatores.push('Frequência irregular');
    }

    let acaoSugerida = '';
    if (risco > 70) {
      acaoSugerida = 'Contato urgente com responsável. Oferecer plano de recuperação.';
    } else if (risco > 50) {
      acaoSugerida = 'Agendar reunião com responsável e aluno.';
    } else if (risco > 30) {
      acaoSugerida = 'Monitorar de perto e enviar comunicado.';
    }

    return {
      alunoId: aluno.id,
      alunoNome: aluno.nome,
      risco: Math.min(100, risco),
      fatores,
      acaoSugerida,
    };
  }).sort((a, b) => b.risco - a.risco);

  // Risco de Inadimplência
  const riscoInadimplencia = alunos.map((aluno) => {
    const fatores: string[] = [];
    let risco = 10;

    const mensAluno = mensalidades.filter((m) => m.alunoId === aluno.id);
    const atrasadas = mensAluno.filter((m) => m.status === 'atrasado').length;
    const pendentes = mensAluno.filter((m) => m.status === 'pendente').length;

    if (atrasadas > 0) {
      risco += 45 * atrasadas;
      fatores.push(`Histórico de ${atrasadas} atraso(s)`);
    }
    if (pendentes > 0) {
      risco += 25 * pendentes;
      fatores.push(`${pendentes} mensalidade(s) pendente(s)`);
    }

    // Desempenho acadêmico correlaciona com inadimplência
    const notasAluno = gabaritos.flatMap((g) => g.notas.filter((n) => n.alunoId === aluno.id));
    if (notasAluno.length > 0) {
      const mediaNotas = notasAluno.reduce((acc, n) => acc + n.nota, 0) / notasAluno.length;
      if (mediaNotas < 5) {
        risco += 25;
        fatores.push('Desempenho acadêmico baixo');
      }
    }

    let acaoSugerida = '';
    if (risco > 70) {
      acaoSugerida = 'Ligar imediatamente para o responsável. Oferecer negociação.';
    } else if (risco > 50) {
      acaoSugerida = 'Enviar WhatsApp de lembrete com 3 dias de antecedência.';
    } else if (risco > 30) {
      acaoSugerida = 'Enviar email de lembrete automático.';
    }

    return {
      alunoId: aluno.id,
      alunoNome: aluno.nome,
      risco: Math.min(100, risco),
      fatores,
      acaoSugerida,
    };
  }).sort((a, b) => b.risco - a.risco);

  // Desempenho por Turma com tendência
  const turmasMap = new Map<string, { notas: number[]; nome: string }>();
  
  alunos.forEach((aluno) => {
    if (!turmasMap.has(aluno.turmaId)) {
      turmasMap.set(aluno.turmaId, { notas: [], nome: '' });
    }
    const notasAluno = gabaritos.flatMap((g) => g.notas.filter((n) => n.alunoId === aluno.id));
    notasAluno.forEach((n) => turmasMap.get(aluno.turmaId)!.notas.push(n.nota));
  });

  const desempenhoTurma = Array.from(turmasMap.entries()).map(([turmaId, data]) => {
    const media = data.notas.length > 0 ? data.notas.reduce((a, b) => a + b, 0) / data.notas.length : 0;
    
    // Simular tendência
    const tendencia: 'melhorando' | 'estavel' | 'piorando' = 
      media >= 7.5 ? 'melhorando' : media >= 5.5 ? 'estavel' : 'piorando';

    return {
      turmaId,
      turmaNome: data.nome || turmaId,
      media: Math.round(media * 10) / 10,
      totalAlunos: alunos.filter((a) => a.turmaId === turmaId).length,
      tendencia,
    };
  });

  // Gerar sugestões inteligentes
  const alunosRiscoEvasao = riscoEvasao.filter((r) => r.risco > 50);
  if (alunosRiscoEvasao.length > 0) {
    sugestoesIA.push(`${alunosRiscoEvasao.length} aluno(s) com alto risco de evasão. Priorize contato imediato.`);
  }

  const alunosRiscoInadimplencia = riscoInadimplencia.filter((r) => r.risco > 50);
  if (alunosRiscoInadimplencia.length > 0) {
    sugestoesIA.push(`${alunosRiscoInadimplencia.length} aluno(s) com risco de inadimplência. Envie lembretes preventivos.`);
  }

  const turmasBaixoDesempenho = desempenhoTurma.filter((t) => t.media < 6);
  if (turmasBaixoDesempenho.length > 0) {
    sugestoesIA.push(`${turmasBaixoDesempenho.length} turma(s) com desempenho abaixo da média. Considere reforço escolar.`);
  }

  if (sugestoesIA.length === 0) {
    sugestoesIA.push('Sistema operando normalmente. Continue monitorando os indicadores.');
  }

  return { riscoEvasao, riscoInadimplencia, desempenhoTurma, sugestoesIA };
}

// ============ PREVISÃO DE FLUXO DE CAIXA ============

export interface PrevisaoFluxoCaixa {
  meses: Array<{
    mes: string;
    receitaPrevista: number;
    despesaPrevista: number;
    lucroPrevisto: number;
    confianca: number;
  }>;
}

export function IAPreverFluxoCaixa(
  mensalidades: Mensalidade[],
  meses: number = 3
): PrevisaoFluxoCaixa {
  const previsao: PrevisaoFluxoCaixa = { meses: [] };
  
  const hoje = new Date();
  
  for (let i = 1; i <= meses; i++) {
    const dataPrevista = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
    const mesNome = dataPrevista.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    
    // Calcular receita prevista baseada em mensalidades ativas
    const mensalidadeMedia = mensalidades.length > 0 
      ? mensalidades.reduce((acc, m) => acc + m.valor, 0) / mensalidades.length 
      : 850;
    
    const alunosAtivosEstimados = Math.max(1, mensalidades.filter((m) => m.status !== 'atrasado').length);
    const taxaAdimplencia = 0.85; // 85% de adimplência esperada
    
    const receitaPrevista = alunosAtivosEstimados * mensalidadeMedia * taxaAdimplencia;
    const despesaPrevista = receitaPrevista * 0.65; // Estimativa de 65% de despesas
    const lucroPrevisto = receitaPrevista - despesaPrevista;
    
    // Confiança diminui com o tempo
    const confianca = Math.max(50, 95 - (i * 10));
    
    previsao.meses.push({
      mes: mesNome,
      receitaPrevista: Math.round(receitaPrevista),
      despesaPrevista: Math.round(despesaPrevista),
      lucroPrevisto: Math.round(lucroPrevisto),
      confianca,
    });
  }
  
  return previsao;
}

// ============ SUGESTÃO DE REAJUSTE ============

export interface SugestaoReajuste {
  valorAtual: number;
  valorSugerido: number;
  percentualReajuste: number;
  justificativa: string;
}

export function IASugerirReajuste(valorAtual: number): SugestaoReajuste {
  // Simular cálculo baseado em inflação + mercado
  const inflacaoAnual = 0.05; // 5%
  const ajusteMercado = 0.02; // 2% adicional
  const percentualTotal = inflacaoAnual + ajusteMercado;
  
  const valorSugerido = valorAtual * (1 + percentualTotal);
  
  return {
    valorAtual,
    valorSugerido: Math.round(valorSugerido),
    percentualReajuste: Math.round(percentualTotal * 100),
    justificativa: `Reajuste sugerido baseado na inflação anual (${(inflacaoAnual * 100).toFixed(1)}%) + ajuste de mercado (${(ajusteMercado * 100).toFixed(1)}%). Total: ${(percentualTotal * 100).toFixed(1)}%.`,
  };
}

// ============ DETECÇÃO DE DESPESAS ATÍPICAS ============

export function IADetectarDespesasAtipicas(despesas: Array<{ valor: number; categoria: string }>): string[] {
  const alertas: string[] = [];
  
  if (despesas.length === 0) return alertas;
  
  const mediaPorCategoria = new Map<string, number[]>();
  
  despesas.forEach((d) => {
    if (!mediaPorCategoria.has(d.categoria)) {
      mediaPorCategoria.set(d.categoria, []);
    }
    mediaPorCategoria.get(d.categoria)!.push(d.valor);
  });
  
  despesas.forEach((d) => {
    const valores = mediaPorCategoria.get(d.categoria) || [];
    const media = valores.reduce((a, b) => a + b, 0) / valores.length;
    const desvio = Math.abs(d.valor - media);
    
    if (desvio > media * 0.5) { // 50% acima da média
      alertas.push(`Despesa atípica em "${d.categoria}": R$ ${d.valor.toFixed(2)} (média: R$ ${media.toFixed(2)})`);
    }
  });
  
  return alertas;
}

// ============ ANÁLISE DE ENGAGEMENT DO AVA ============

export interface AnaliseEngajamentoAVA {
  taxaConclusao: number;
  tempoMedioEstudo: number; // minutos
  materiaisMaisAcessados: Array<{ titulo: string; acessos: number }>;
  alunosInativos: Array<{ alunoId: string; alunoNome: string; diasInativo: number }>;
}

export function IAAnalisarEngajamentoAVA(materiais: MaterialAVA[]): AnaliseEngajamentoAVA {
  // Simular dados de engajamento
  const taxaConclusao = 65 + Math.random() * 20; // 65-85%
  const tempoMedioEstudo = 45 + Math.random() * 30; // 45-75 minutos
  
  const materiaisMaisAcessados = materiais
    .map((m) => ({ titulo: m.titulo, acessos: Math.floor(Math.random() * 100) + 10 }))
    .sort((a, b) => b.acessos - a.acessos)
    .slice(0, 5);
  
  const alunosInativos = [
    { alunoId: 'a5', alunoNome: 'Isabela Rodrigues', diasInativo: 15 },
    { alunoId: 'a3', alunoNome: 'Ana Beatriz Costa', diasInativo: 8 },
  ];
  
  return {
    taxaConclusao: Math.round(taxaConclusao),
    tempoMedioEstudo: Math.round(tempoMedioEstudo),
    materiaisMaisAcessados,
    alunosInativos,
  };
}
