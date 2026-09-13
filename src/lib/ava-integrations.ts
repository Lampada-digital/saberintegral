import { useEventBus } from './eventBus';
import { useAVAStore } from './ava-store';

export function registerAVAEventHandlers() {
  const { on } = useEventBus.getState();

  on('aluno_matriculado', (payload) => {
    const avaStore = useAVAStore.getState();
    const turmaId = payload.data?.turmaId;
    if (!turmaId) return;

    const trilhasDaTurma = avaStore.trilhas.filter((t) => t.turmaId === turmaId);
    trilhasDaTurma.forEach((trilha) => {
      avaStore.desbloquearTrilhaParaAluno(payload.entityId, trilha.id);
    });

    console.log('[AVA] Trilhas desbloqueadas para aluno:', payload.entityId);
  });

  console.log('[AVA] Event handlers registrados');
}

if (typeof window !== 'undefined') {
  registerAVAEventHandlers();
}
