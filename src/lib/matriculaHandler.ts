import { useEventBus, type EventPayload } from './eventBus';
import { useStore } from './store';
import { useToastStore } from './store';
import { useNotificationStore } from './notifications';

export interface MatriculaData {
  aluno: {
    nome: string;
    email: string;
    dataNascimento: string;
    cpf?: string;
    rg?: string;
    sexo?: 'M' | 'F' | 'Outro';
    telefone?: string;
    celular?: string;
    responsavel: string;
    responsavelTelefone?: string;
    responsavelEmail?: string;
    responsavelCpf?: string;
    responsavelParentesco?: string;
    endereco?: {
      cep?: string;
      logradouro?: string;
      numero?: string;
      complemento?: string;
      bairro?: string;
      cidade?: string;
      estado?: string;
    };
    saude?: {
      tipoSanguineo?: string;
      alergias?: string;
      medicamentos?: string;
      planoSaude?: string;
      contatoEmergencia?: string;
    };
  };
  turmaId: string;
  dataMatricula: string;
  observacoes?: string;
}

export interface MatriculaProgress {
  step: number;
  totalSteps: number;
  currentAction: string;
  status: 'pending' | 'running' | 'success' | 'error';
  details?: string;
}

class MatriculaProgressTracker {
  private progress: MatriculaProgress;
  private onUpdate: (progress: MatriculaProgress) => void;

  constructor(totalSteps: number, onUpdate: (progress: MatriculaProgress) => void) {
    this.progress = {
      step: 0,
      totalSteps,
      currentAction: 'Iniciando matrícula...',
      status: 'pending',
    };
    this.onUpdate = onUpdate;
  }

  startStep(action: string) {
    this.progress.step++;
    this.progress.currentAction = action;
    this.progress.status = 'running';
    this.onUpdate({ ...this.progress });
  }

  completeStep(details?: string) {
    this.progress.status = 'success';
    this.progress.details = details;
    this.onUpdate({ ...this.progress });
  }

  failStep(error: string) {
    this.progress.status = 'error';
    this.progress.details = error;
    this.onUpdate({ ...this.progress });
  }
}

export async function executarMatriculaCompleta(
  matriculaData: MatriculaData,
  onProgressUpdate: (progress: MatriculaProgress) => void
): Promise<{ success: boolean; alunoId: string; error?: string }> {
  const store = useStore.getState();
  const toast = useToastStore.getState();
  const notifications = useNotificationStore.getState();
  const eventBus = useEventBus.getState();

  const tracker = new MatriculaProgressTracker(6, onProgressUpdate);
  const rollbackActions: Array<() => void> = [];

  try {
    // STEP 1: Criar Aluno
    tracker.startStep('Criando registro do aluno...');
    await new Promise((r) => setTimeout(r, 300));

    const alunoId = `aluno_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const novoAluno = {
      id: alunoId,
      nome: matriculaData.aluno.nome,
      email: matriculaData.aluno.email,
      turmaId: matriculaData.turmaId,
      responsavel: matriculaData.aluno.responsavel,
      telefone: matriculaData.aluno.telefone || '',
      dataNascimento: matriculaData.aluno.dataNascimento,
      status: 'ativo' as const,
      cpf: matriculaData.aluno.cpf,
      rg: matriculaData.aluno.rg,
      sexo: matriculaData.aluno.sexo,
      celular: matriculaData.aluno.celular,
      responsavelTelefone: matriculaData.aluno.responsavelTelefone,
      responsavelEmail: matriculaData.aluno.responsavelEmail,
      responsavelCpf: matriculaData.aluno.responsavelCpf,
      responsavelParentesco: matriculaData.aluno.responsavelParentesco,
      cep: matriculaData.aluno.endereco?.cep,
      logradouro: matriculaData.aluno.endereco?.logradouro,
      numero: matriculaData.aluno.endereco?.numero,
      complemento: matriculaData.aluno.endereco?.complemento,
      bairro: matriculaData.aluno.endereco?.bairro,
      cidade: matriculaData.aluno.endereco?.cidade,
      estado: matriculaData.aluno.endereco?.estado,
      tipoSanguineo: matriculaData.aluno.saude?.tipoSanguineo,
      alergias: matriculaData.aluno.saude?.alergias,
      medicamentos: matriculaData.aluno.saude?.medicamentos,
      planoSaude: matriculaData.aluno.saude?.planoSaude,
      contatoEmergencia: matriculaData.aluno.saude?.contatoEmergencia,
      dataMatricula: matriculaData.dataMatricula,
      observacoes: matriculaData.observacoes,
    };

    store.addAluno(novoAluno);
    rollbackActions.push(() => store.deleteAluno(alunoId));
    tracker.completeStep(`Aluno ${alunoId} criado com sucesso`);

    // STEP 2: Matricular no AVA
    tracker.startStep('Matriculando aluno no AVA...');
    await new Promise((r) => setTimeout(r, 400));

    const materiaisTurma = store.materiaisAVA.filter((m) => m.turmaId === matriculaData.turmaId);
    
    await eventBus.emit('aluno_matriculado_ava', {
      entityId: alunoId,
      entityName: matriculaData.aluno.nome,
       {
        turmaId: matriculaData.turmaId,
        materiaisDisponiveis: materiaisTurma.length,
      },
      priority: 'normal',
    });

    tracker.completeStep(`${materiaisTurma.length} materiais disponíveis no AVA`);

    // STEP 3: Gerar Mensalidades
    tracker.startStep('Gerando mensalidades...');
    await new Promise((r) => setTimeout(r, 500));

    const mesesRestantes = 12 - new Date().getMonth();
    const valorMensalidade = 850;

    const mensalidadesGeradas: string[] = [];
    for (let i = 0; i < mesesRestantes; i++) {
      const mes = new Date(new Date().getFullYear(), new Date().getMonth() + i, 1);
      const mesString = mes.toISOString().slice(0, 7);
      const vencimento = `${mesString}-10`;

      const mensalidadeId = `mens_${Date.now()}_${i}`;
      store.addMensalidade({
        alunoId,
        alunoNome: matriculaData.aluno.nome,
        valor: valorMensalidade,
        vencimento,
        status: 'pendente',
      });
      mensalidadesGeradas.push(mensalidadeId);
    }

    tracker.completeStep(`${mesesRestantes} mensalidades geradas (R$ ${valorMensalidade} cada)`);

    // STEP 4: Notificar Professor
    tracker.startStep('Notificando professor da turma...');
    await new Promise((r) => setTimeout(r, 300));

    const turma = store.turmas.find((t) => t.id === matriculaData.turmaId);
    if (turma) {
      const professor = store.professores.find((p) => p.id === turma.professorResponsavelId);
      if (professor) {
        await notifications.sendNotification({
          channel: 'email',
          recipient: {
            type: 'professor',
            id: professor.id,
            name: professor.nome,
            contact: professor.email,
          },
          title: 'Novo Aluno Matriculado',
          message: `O aluno ${matriculaData.aluno.nome} foi matriculado na turma ${turma.nome}.`,
          priority: 'normal',
        });

        tracker.completeStep(`Professor ${professor.nome} notificado`);
      } else {
        tracker.completeStep('Professor não encontrado');
      }
    } else {
      tracker.completeStep('Turma não encontrada');
    }

    // STEP 5: Liberar Acesso ao Portal dos Pais
    tracker.startStep('Liberando acesso ao Portal dos Pais...');
    await new Promise((r) => setTimeout(r, 300));

    if (matriculaData.aluno.responsavelEmail) {
      await notifications.sendNotification({
        channel: 'email',
        recipient: {
          type: 'responsavel',
          id: alunoId,
          name: matriculaData.aluno.responsavel,
          contact: matriculaData.aluno.responsavelEmail,
        },
        title: 'Acesso ao Portal dos Pais Liberado',
        message: `Prezado(a) ${matriculaData.aluno.responsavel}, o acesso ao Portal dos Pais foi liberado.`,
        priority: 'high',
      });

      tracker.completeStep('Email de boas-vindas enviado aos pais');
    } else {
      tracker.completeStep('Email do responsável não informado');
    }

    // STEP 6: Atualizar Dashboard
    tracker.startStep('Atualizando métricas do Dashboard...');
    await new Promise((r) => setTimeout(r, 200));

    await eventBus.emit('dashboard_atualizado', {
      entityId: alunoId,
      entityName: matriculaData.aluno.nome,
       {
        tipo: 'nova_matricula',
        turmaId: matriculaData.turmaId,
      },
      priority: 'low',
    });

    tracker.completeStep('Dashboard atualizado com novas métricas');

    // EMITIR EVENTO FINAL
    await eventBus.emit('matricula_realizada', {
      entityId: alunoId,
      entityName: matriculaData.aluno.nome,
       {
        turmaId: matriculaData.turmaId,
        dataMatricula: matriculaData.dataMatricula,
        mensalidadesGeradas: mensalidadesGeradas.length,
      },
      priority: 'high',
    });

    toast.addToast(`✅ Matrícula de ${matriculaData.aluno.nome} realizada com sucesso!`, 'success');

    return { success: true, alunoId };

  } catch (error) {
    console.error('[Matrícula] Erro durante matrícula, executando rollback...', error);
    
    rollbackActions.forEach((action) => {
      try {
        action();
      } catch (rollbackError) {
        console.error('[Matrícula] Erro no rollback:', rollbackError);
      }
    });

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    tracker.failStep(errorMessage);
    toast.addToast(`❌ Erro na matrícula: ${errorMessage}`, 'error');

    return { success: false, alunoId: '', error: errorMessage };
  }
}

export function registerMatriculaHandler() {
  const { on } = useEventBus.getState();

  on('matricula_realizada', async (payload: EventPayload) => {
    console.log('[Matrícula] Evento matricula_realizada recebido:', payload);
  });

  console.log('[Matrícula] Handler registrado');
}

if (typeof window !== 'undefined') {
  registerMatriculaHandler();
}
