/**
 * 🎯 EVENT BUS CENTRAL - Arquitetura Orientada a Eventos
 * 
 * Sistema de eventos pub/sub para integração bidirecional entre módulos.
 * Cada ação do sistema emite eventos que disparam atualizações em cascata.
 * 
 * Fluxo: Action → Event → Handlers → Updates → Notifications
 */

import { create } from 'zustand';

// ============ TIPOS DE EVENTOS ============
export type EventName =
  // Alunos
  | 'aluno_criado'
  | 'aluno_atualizado'
  | 'aluno_excluido'
  | 'aluno_transferido'
  // Turmas
  | 'turma_criada'
  | 'turma_atualizada'
  | 'turma_excluida'
  // Professores
  | 'professor_criado'
  | 'professor_atualizado'
  | 'professor_excluido'
  // Acadêmico
  | 'nota_lancada'
  | 'nota_atualizada'
  | 'frequencia_lancada'
  | 'redacao_corrigida'
  | 'prova_criada'
  | 'prova_corrigida'
  // AVA
  | 'material_publicado'
  | 'material_atualizado'
  | 'material_excluido'
  | 'atividade_entregue'
  | 'atividade_corrigida'
  | 'trilha_concluida'
  // Financeiro
  | 'mensalidade_gerada'
  | 'mensalidade_paga'
  | 'mensalidade_atrasada'
  | 'despesa_registrada'
  | 'fatura_emitida'
  // Sistema
  | 'usuario_logado'
  | 'usuario_deslogado'
  | 'config_atualizada'
  | 'backup_realizado'
  | 'importacao_realizada';

export interface EventPayload {
  // Contexto
  eventId: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  
  // Dados do evento
  eventName: EventName;
  entityType: string;
  entityId: string;
  entityName?: string;
  
  // Dados específicos
  data: Record<string, any>;
  
  // Metadados
  source: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
}

export type EventHandler = (payload: EventPayload) => void | Promise<void>;

interface EventSubscription {
  id: string;
  eventName: EventName;
  handler: EventHandler;
  priority: number;
  once: boolean;
}

// ============ EVENT BUS STORE ============
interface EventBusState {
  // Subscriptions
  subscriptions: EventSubscription[];
  
  // Event log (auditoria)
  eventLog: EventPayload[];
  maxLogSize: number;
  
  // Stats
  totalEventsEmitted: number;
  eventsByType: Record<EventName, number>;
  
  // Actions
  emit: (eventName: EventName, payload: Partial<EventPayload>) => Promise<void>;
  on: (eventName: EventName, handler: EventHandler, options?: { priority?: number; once?: boolean }) => string;
  off: (subscriptionId: string) => void;
  clearLog: () => void;
  reset: () => void;
}

export const useEventBus = create<EventBusState>()((set, get) => ({
  subscriptions: [],
  eventLog: [],
  maxLogSize: 1000,
  totalEventsEmitted: 0,
  eventsByType: {} as Record<EventName, number>,

  emit: async (eventName, partialPayload) => {
    const payload: EventPayload = {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      eventName,
      priority: 'normal',
      source: 'system',
      entityType: eventName.split('_')[0],
      entityId: partialPayload.entityId || '',
      entityName: partialPayload.entityName,
      data: partialPayload.data || {},
      userId: partialPayload.userId,
      userName: partialPayload.userName,
    };

    // Log do evento
    set((state) => {
      const newLog = [payload, ...state.eventLog].slice(0, state.maxLogSize);
      const eventsByType = {
        ...state.eventsByType,
        [eventName]: (state.eventsByType[eventName] || 0) + 1,
      };
      return {
        eventLog: newLog,
        totalEventsEmitted: state.totalEventsEmitted + 1,
        eventsByType,
      };
    });

    // Executar handlers
    const { subscriptions } = get();
    const relevantSubs = subscriptions
      .filter((sub) => sub.eventName === eventName)
      .sort((a, b) => b.priority - a.priority);

    for (const sub of relevantSubs) {
      try {
        await sub.handler(payload);
      } catch (error) {
        console.error(`[EventBus] Erro no handler do evento ${eventName}:`, error);
      }
      
      // Remover se for "once"
      if (sub.once) {
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.id !== sub.id),
        }));
      }
    }

    // Console log para debug
    if (typeof window !== 'undefined' && (window as any).__EVENT_BUS_DEBUG__) {
      console.log(`[EventBus] ${eventName}`, payload);
    }
  },

  on: (eventName, handler, options = {}) => {
    const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const subscription: EventSubscription = {
      id,
      eventName,
      handler,
      priority: options.priority || 0,
      once: options.once || false,
    };

    set((state) => ({
      subscriptions: [...state.subscriptions, subscription],
    }));

    return id;
  },

  off: (subscriptionId) => {
    set((state) => ({
      subscriptions: state.subscriptions.filter((s) => s.id !== subscriptionId),
    }));
  },

  clearLog: () => set({ eventLog: [] }),

  reset: () => set({
    subscriptions: [],
    eventLog: [],
    totalEventsEmitted: 0,
    eventsByType: {} as Record<EventName, number>,
  }),
}));

// ============ HOOKS AUXILIARES ============

/**
 * Hook para subscrever a eventos com cleanup automático
 */
export function useEventSubscription(
  eventName: EventName,
  handler: EventHandler,
  options?: { priority?: number; once?: boolean }
) {
  const { on, off } = useEventBus();
  
  // React.useEffect seria ideal, mas como é um módulo standalone,
  // retornamos a função de cleanup
  const subscriptionId = on(eventName, handler, options);
  
  return () => off(subscriptionId);
}

/**
 * Ativa debug no console
 */
export function enableEventBusDebug() {
  if (typeof window !== 'undefined') {
    (window as any).__EVENT_BUS_DEBUG__ = true;
    console.log('[EventBus] Debug mode ativado');
  }
}

/**
 * Desativa debug
 */
export function disableEventBusDebug() {
  if (typeof window !== 'undefined') {
    (window as any).__EVENT_BUS_DEBUG__ = false;
  }
}
