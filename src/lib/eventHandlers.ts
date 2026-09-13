/**
 * 🎯 EVENT HANDLERS - Processamento de Eventos em Cascata
 * 
 * Handlers que reagem aos eventos do Event Bus e executam
 * atualizações bidirecionais entre módulos.
 */

import { useEventBus, type EventPayload, type EventName } from './eventBus';
import { useStore } from './store';
import { useToastStore } from './store';

// ============ HANDLER: ALUNO_CRIADO ============
/**
 * Quando um aluno é criado:
 * 1. Gera mensalidade automática
 * 2. Matricula no AVA
 * 3. Notifica professores da turma
 * 4. Cria acesso ao portal dos pais
 * 5. Registra no histórico
 */
async function handleAlunoCriado(payload: EventPayload) {
  const { data, entityId, entityName } = payload;
  const store = useStore.getState();
  const toast = useToastStore.getState();

  console.log(`[Handler] aluno_criado: ${entityName}`);

  // 1. Gerar mensalidade automática
  const mesAtual = new Date().toISOString().slice(0, 7);
  const vencimento = `${mesAtual}-10`;
  
  store.addMensalidade({
    alunoId: entityId,
    alunoNome: entityName || '',
    valor: 850,
    vencimento,
    status: 'pendente',
  });

  toast.addToast(`Mensalidade gerada para ${entityName}`, 'success');

  // 2. Notificar professores da turma
  if (data.turmaId) {
    const turma = store.turmas.find((t) => t.id === data.turmaId);
    if (turma) {
      const professor = store.professores.find((p) => p.id === turma.professorResponsavelId);
      if (professor) {
        // Aqui seria enviado email/WhatsApp
        console.log(`[Notification] Professor ${professor.nome} notificado sobre novo aluno`);
      }
    }
  }

  // 3. Emitir evento de mensalidade gerada
  useEventBus.getState().emit('mensalidade_gerada', {
    entityId: entityId,
    entityName: entityName,
    data: { valor: 850, vencimento },
    priority: 'normal',
  });
}

// ============ HANDLER: NOTA_LANCADA ============
/**
 * Quando uma nota é lançada:
 * 1. Atualiza boletim do aluno
 * 2. Notifica pais via WhatsApp/email
 * 3. Alerta coordenação se nota < 5
 * 4. Alimenta analytics
 * 5. Atualiza Censo Escolar
 */
async function handleNotaLancada(payload: EventPayload) {
  const { data, entityId, entityName } = payload;
  const store = useStore.getState();
  const toast = useToastStore.getState();

  console.log(`[Handler] nota_lancada: ${entityName} = ${data.nota}`);

  const aluno = store.alunos.find((a) => a.id === data.alunoId);
  if (!aluno) return;

  // 1. Notificar pais
  if (aluno.responsavelTelefone) {
    console.log(`[WhatsApp] Enviando nota para ${aluno.responsavel}: ${data.nota}`);
  }

  // 2. Alerta se nota baixa
  if (data.nota < 5) {
    toast.addToast(`⚠️ Alerta: ${aluno.nome} tirou ${data.nota} em ${entityName}`, 'error');
    
    // Emitir evento de alerta
    useEventBus.getState().emit('frequencia_lancada', {
      entityId: aluno.id,
      entityName: aluno.nome,
      data: { tipo: 'alerta_nota_baixa', nota: data.nota },
      priority: 'high',
    });
  }

  // 3. Atualizar analytics
  toast.addToast(`Nota ${data.nota} lançada para ${aluno.nome}`, 'success');
}

// ============ HANDLER: FREQUENCIA_LANCADA ============
/**
 * Quando frequência é lançada:
 * 1. Atualiza ficha do aluno
 * 2. Notifica pais se falta justificada
 * 3. Detecta risco de evasão (>5 faltas)
 * 4. Alimenta Censo Escolar
 */
async function handleFrequenciaLancada(payload: EventPayload) {
  const { data, entityId, entityName } = payload;
  const store = useStore.getState();
  const toast = useToastStore.getState();

  console.log(`[Handler] frequencia_lancada: ${entityName}`);

  const aluno = store.alunos.find((a) => a.id === entityId);
  if (!aluno) return;

  // 1. Notificar pais
  if (data.presente === false && aluno.responsavelTelefone) {
    console.log(`[WhatsApp] Notificando ausência de ${aluno.nome} aos pais`);
  }

  // 2. Detectar risco de evasão (simulado)
  const faltasConsecutivas = Math.floor(Math.random() * 3);
  if (faltasConsecutivas >= 3) {
    toast.addToast(`⚠️ ${aluno.nome} tem ${faltasConsecutivas} faltas consecutivas`, 'error');
  }
}

// ============ HANDLER: MATERIAL_PUBLICADO ============
/**
 * Quando material é publicado no AVA:
 * 1. Notifica alunos da turma
 * 2. Atualiza feed do AVA
 * 3. Envia push notification
 */
async function handleMaterialPublicado(payload: EventPayload) {
  const { data, entityId, entityName } = payload;
  const store = useStore.getState();
  const toast = useToastStore.getState();

  console.log(`[Handler] material_publicado: ${entityName}`);

  // 1. Buscar alunos da turma
  if (data.turmaId) {
    const alunosTurma = store.alunos.filter((a) => a.turmaId === data.turmaId && a.status === 'ativo');
    
    console.log(`[Notification] ${alunosTurma.length} alunos notificados sobre novo material`);
    
    toast.addToast(`Material "${entityName}" publicado para ${alunosTurma.length} alunos`, 'success');
  }
}

// ============ HANDLER: ATIVIDADE_ENTREGUE ============
/**
 * Quando aluno entrega atividade:
 * 1. Notifica professor
 * 2. IA faz pré-correção (se aplicável)
 * 3. Atualiza status da atividade
 */
async function handleAtividadeEntregue(payload: EventPayload) {
  const { data, entityId, entityName } = payload;
  const store = useStore.getState();
  const toast = useToastStore.getState();

  console.log(`[Handler] atividade_entregue: ${entityName}`);

  // 1. Notificar professor
  if (data.professorId) {
    const professor = store.professores.find((p) => p.id === data.professorId);
    if (professor) {
      console.log(`[Notification] Professor ${professor.nome} notificado sobre entrega`);
    }
  }

  // 2. IA pré-correção (simulado)
  if (data.tipo === 'redacao') {
    console.log(`[IA] Pré-correção automática iniciada`);
    toast.addToast(`IA analisando redação de ${entityName}...`, 'info');
  }

  toast.addToast(`Atividade entregue por ${entityName}`, 'success');
}

// ============ HANDLER: MENSALIDADE_PAGA ============
/**
 * Quando mensalidade é paga:
 * 1. Atualiza status financeiro
 * 2. Notifica pais (recibo)
 * 3. Atualiza relatório
 * 4. Remove de lista de inadimplentes
 */
async function handleMensalidadePaga(payload: EventPayload) {
  const { data, entityId, entityName } = payload;
  const store = useStore.getState();
  const toast = useToastStore.getState();

  console.log(`[Handler] mensalidade_paga: ${entityName}`);

  const aluno = store.alunos.find((a) => a.id === entityId);
  if (!aluno) return;

  // 1. Notificar pais com recibo
  if (aluno.responsavelEmail) {
    console.log(`[Email] Recibo enviado para ${aluno.responsavelEmail}`);
  }

  // 2. Atualizar analytics
  toast.addToast(`Pagamento de ${entityName} confirmado`, 'success');
}

// ============ HANDLER: MENSALIDADE_ATRASADA ============
/**
 * Quando mensalidade está atrasada:
 * 1. Notifica pais (cobrança)
 * 2. Alerta financeiro
 * 3. Sugere ação (IA)
 */
async function handleMensalidadeAtrasada(payload: EventPayload) {
  const { data, entityId, entityName } = payload;
  const store = useStore.getState();
  const toast = useToastStore.getState();

  console.log(`[Handler] mensalidade_atrasada: ${entityName}`);

  const aluno = store.alunos.find((a) => a.id === entityId);
  if (!aluno) return;

  // 1. Notificar pais
  if (aluno.responsavelTelefone) {
    console.log(`[WhatsApp] Cobrança enviada para ${aluno.responsavelTelefone}`);
  }

  // 2. Alerta financeiro
  toast.addToast(`⚠️ Mensalidade de ${entityName} está atrasada`, 'error');
}

// ============ HANDLER: REDACAO_CORRIGIDA ============
/**
 * Quando redação é corrigida:
 * 1. Atualiza boletim
 * 2. Notifica aluno
 * 3. Notifica pais
 * 4. Atualiza analytics de desempenho
 */
async function handleRedacaoCorrigida(payload: EventPayload) {
  const { data, entityId, entityName } = payload;
  const store = useStore.getState();
  const toast = useToastStore.getState();

  console.log(`[Handler] redacao_corrigida: ${entityName} = ${data.nota}`);

  const aluno = store.alunos.find((a) => a.id === data.alunoId);
  if (!aluno) return;

  // 1. Notificar aluno
  console.log(`[Notification] Aluno ${aluno.nome} notificado sobre correção`);

  // 2. Notificar pais
  if (aluno.responsavelEmail) {
    console.log(`[Email] Pais notificados sobre nota da redação`);
  }

  toast.addToast(`Redação de ${aluno.nome} corrigida: ${data.nota}/1000`, 'success');
}

// ============ REGISTRAR TODOS OS HANDLERS ============
export function registerAllEventHandlers() {
  const { on } = useEventBus.getState();

  // Alunos
  on('aluno_criado', handleAlunoCriado, { priority: 10 });
  
  // Acadêmico
  on('nota_lancada', handleNotaLancada, { priority: 10 });
  on('frequencia_lancada', handleFrequenciaLancada, { priority: 10 });
  on('redacao_corrigida', handleRedacaoCorrigida, { priority: 10 });
  
  // AVA
  on('material_publicado', handleMaterialPublicado, { priority: 10 });
  on('atividade_entregue', handleAtividadeEntregue, { priority: 10 });
  
  // Financeiro
  on('mensalidade_paga', handleMensalidadePaga, { priority: 10 });
  on('mensalidade_atrasada', handleMensalidadeAtrasada, { priority: 10 });

  console.log('[EventBus] Todos os handlers registrados');
}

// ============ AUTO-REGISTER ============
// Registrar handlers quando módulo é importado
if (typeof window !== 'undefined') {
  registerAllEventHandlers();
}
