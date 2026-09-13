/**
 * 📱 SISTEMA DE NOTIFICAÇÕES - Multi-canal
 * 
 * Suporta: WhatsApp, Email, Push Notification, SMS, In-App
 * Integração com Event Bus para notificações automáticas
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============ TIPOS ============
export type NotificationChannel = 'whatsapp' | 'email' | 'push' | 'sms' | 'in_app';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'read';

export interface Notification {
  id: string;
  channel: NotificationChannel;
  recipient: {
    type: 'aluno' | 'responsavel' | 'professor' | 'coordenacao';
    id: string;
    name: string;
    contact: string; // phone or email
  };
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  relatedEntity?: {
    type: string;
    id: string;
    name?: string;
  };
  metadata?: Record<string, any>;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: NotificationChannel;
  subject?: string; // for email
  body: string; // supports {{variables}}
  variables: string[];
}

// ============ NOTIFICATION STORE ============
interface NotificationState {
  notifications: Notification[];
  templates: NotificationTemplate[];
  preferences: {
    whatsapp: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
  
  // Actions
  sendNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  sendBulk: (notifications: Omit<Notification, 'id' | 'createdAt' | 'status'>[]) => Promise<string[]>;
  markAsRead: (id: string) => void;
  markAsDelivered: (id: string) => void;
  getUnread: () => Notification[];
  getByRecipient: (recipientId: string) => Notification[];
  addTemplate: (template: Omit<NotificationTemplate, 'id'>) => void;
  updatePreferences: (prefs: Partial<NotificationState['preferences']>) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      templates: [
        {
          id: 'tpl_nota',
          name: 'Nota Lançada',
          channel: 'whatsapp',
          body: 'Olá {{responsavel}}, a nota de {{aluno}} em {{disciplina}} foi lançada: {{nota}}. Acesse o portal para mais detalhes.',
          variables: ['responsavel', 'aluno', 'disciplina', 'nota'],
        },
        {
          id: 'tpl_falta',
          name: 'Falta Registrada',
          channel: 'whatsapp',
          body: 'Olá {{responsavel}}, registramos a falta de {{aluno}} no dia {{data}}. Por favor, justifique se necessário.',
          variables: ['responsavel', 'aluno', 'data'],
        },
        {
          id: 'tpl_mensalidade',
          name: 'Mensalidade Gerada',
          channel: 'email',
          subject: 'Mensalidade {{mes}} - {{escola}}',
          body: 'Prezado(a) {{responsavel}}, a mensalidade de {{aluno}} referente a {{mes}} no valor de R$ {{valor}} está disponível. Vencimento: {{vencimento}}.',
          variables: ['responsavel', 'aluno', 'mes', 'valor', 'vencimento', 'escola'],
        },
        {
          id: 'tpl_material',
          name: 'Novo Material Publicado',
          channel: 'push',
          body: 'Novo material disponível: {{titulo}} - {{disciplina}}. Acesse o AVA!',
          variables: ['titulo', 'disciplina'],
        },
        {
          id: 'tpl_redacao',
          name: 'Redação Corrigida',
          channel: 'whatsapp',
          body: 'Olá {{aluno}}, sua redação "{{titulo}}" foi corrigida. Nota: {{nota}}/1000. Confira o feedback no portal!',
          variables: ['aluno', 'titulo', 'nota'],
        },
      ],
      preferences: {
        whatsapp: true,
        email: true,
        push: true,
        sms: false,
        inApp: true,
      },

      sendNotification: async (notification) => {
        const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newNotification: Notification = {
          ...notification,
          id,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));

        // Simular envio (em produção, integraria com APIs reais)
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, status: 'sent', sentAt: new Date().toISOString() } : n
            ),
          }));

          // Simular entrega
          setTimeout(() => {
            set((state) => ({
              notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, status: 'delivered', deliveredAt: new Date().toISOString() } : n
              ),
            }));
          }, 1000);
        }, 500);

        // Log para debug
        console.log(`[Notification] ${notification.channel} → ${notification.recipient.name}: ${notification.title}`);

        return id;
      },

      sendBulk: async (notifications) => {
        const ids = await Promise.all(
          notifications.map((n) => get().sendNotification(n))
        );
        return ids;
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, status: 'read', readAt: new Date().toISOString() } : n
          ),
        }));
      },

      markAsDelivered: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, status: 'delivered', deliveredAt: new Date().toISOString() } : n
          ),
        }));
      },

      getUnread: () => {
        return get().notifications.filter((n) => n.status !== 'read');
      },

      getByRecipient: (recipientId) => {
        return get().notifications.filter((n) => n.recipient.id === recipientId);
      },

      addTemplate: (template) => {
        const id = `tpl_${Date.now()}`;
        set((state) => ({
          templates: [...state.templates, { ...template, id }],
        }));
      },

      updatePreferences: (prefs) => {
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        }));
      },
    }),
    {
      name: 'saber-integral-notifications',
    }
  )
);

// ============ HELPER FUNCTIONS ============

/**
 * Renderiza template com variáveis
 */
export function renderTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return result;
}

/**
 * Envia notificação usando template
 */
export async function sendFromTemplate(
  templateId: string,
  recipient: Notification['recipient'],
  variables: Record<string, string>,
  priority: NotificationPriority = 'normal'
) {
  const store = useNotificationStore.getState();
  const template = store.templates.find((t) => t.id === templateId);
  
  if (!template) {
    console.error(`[Notification] Template ${templateId} não encontrado`);
    return;
  }

  const message = renderTemplate(template.body, variables);
  const title = template.subject ? renderTemplate(template.subject, variables) : 'Notificação';

  await store.sendNotification({
    channel: template.channel,
    recipient,
    title,
    message,
    priority,
  });
}

// ============ AUTO-NOTIFICATION HANDLERS ============
// Integra com Event Bus para notificações automáticas

import { useEventBus, type EventPayload } from './eventBus';
import { useStore } from './store';

function setupAutoNotifications() {
  const { on } = useEventBus.getState();

  // Quando nota é lançada, notifica pais
  on('nota_lancada', async (payload: EventPayload) => {
    const store = useStore.getState();
    const aluno = store.alunos.find((a) => a.id === payload.data.alunoId);
    
    if (aluno?.responsavelTelefone) {
      await sendFromTemplate(
        'tpl_nota',
        {
          type: 'responsavel',
          id: aluno.id,
          name: aluno.responsavel || 'Responsável',
          contact: aluno.responsavelTelefone,
        },
        {
          responsavel: aluno.responsavel || 'Responsável',
          aluno: aluno.nome,
          disciplina: payload.entityName || '',
          nota: payload.data.nota.toString(),
        },
        'normal'
      );
    }
  });

  // Quando material é publicado, notifica alunos
  on('material_publicado', async (payload: EventPayload) => {
    const store = useStore.getState();
    const alunos = store.alunos.filter(
      (a) => a.turmaId === payload.data.turmaId && a.status === 'ativo'
    );

    const notifications = alunos.map((aluno) => ({
      channel: 'push' as NotificationChannel,
      recipient: {
        type: 'aluno' as const,
        id: aluno.id,
        name: aluno.nome,
        contact: aluno.email || '',
      },
      title: 'Novo Material Disponível',
      message: renderTemplate('Novo material: {{titulo}} - {{disciplina}}', {
        titulo: payload.entityName || '',
        disciplina: payload.data.disciplina || '',
      }),
      priority: 'normal' as NotificationPriority,
    }));

    await useNotificationStore.getState().sendBulk(notifications);
  });

  // Quando redação é corrigida, notifica aluno
  on('redacao_corrigida', async (payload: EventPayload) => {
    const store = useStore.getState();
    const aluno = store.alunos.find((a) => a.id === payload.data.alunoId);
    
    if (aluno?.email) {
      await sendFromTemplate(
        'tpl_redacao',
        {
          type: 'aluno',
          id: aluno.id,
          name: aluno.nome,
          contact: aluno.email,
        },
        {
          aluno: aluno.nome,
          titulo: payload.data.titulo || 'Redação',
          nota: payload.data.nota.toString(),
        },
        'normal'
      );
    }
  });

  // Quando mensalidade é gerada, notifica pais
  on('mensalidade_gerada', async (payload: EventPayload) => {
    const store = useStore.getState();
    const aluno = store.alunos.find((a) => a.id === payload.entityId);
    
    if (aluno?.responsavelEmail) {
      await sendFromTemplate(
        'tpl_mensalidade',
        {
          type: 'responsavel',
          id: aluno.id,
          name: aluno.responsavel || 'Responsável',
          contact: aluno.responsavelEmail,
        },
        {
          responsavel: aluno.responsavel || 'Responsável',
          aluno: aluno.nome,
          mes: payload.data.vencimento?.slice(0, 7) || '',
          valor: payload.data.valor?.toString() || '0',
          vencimento: payload.data.vencimento || '',
          escola: store.schoolConfig.nomeEscola || 'Escola',
        },
        'normal'
      );
    }
  });

  console.log('[Notifications] Auto-notification handlers registered');
}

// Auto-register
if (typeof window !== 'undefined') {
  setupAutoNotifications();
}
