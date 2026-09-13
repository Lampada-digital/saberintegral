import React, { useState } from 'react';
import { Bell, Check, X, MessageSquare, Mail, Smartphone } from 'lucide-react';
import { useNotificationStore } from '../lib/notifications';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead, getUnread } = useNotificationStore();
  
  const unread = getUnread();
  const recent = notifications.slice(0, 10);

  const channelIcon = (channel: string) => {
    const icons = {
      whatsapp: MessageSquare,
      email: Mail,
      push: Smartphone,
      sms: MessageSquare,
      in_app: Bell,
    };
    const Icon = icons[channel as keyof typeof icons] || Bell;
    return <Icon className="w-4 h-4" />;
  };

  const channelColor = (channel: string) => {
    const colors = {
      whatsapp: 'bg-green-500',
      email: 'bg-blue-500',
      push: 'bg-purple-500',
      sms: 'bg-orange-500',
      in_app: 'bg-gray-500',
    };
    return colors[channel as keyof typeof colors] || 'bg-gray-500';
  };

  const priorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-600',
      normal: 'bg-blue-100 text-blue-600',
      high: 'bg-yellow-100 text-yellow-600',
      urgent: 'bg-red-100 text-red-600',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unread.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unread.length > 9 ? '9+' : unread.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Notificações</h3>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-200 rounded">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              {unread.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {unread.length} não lida{unread.length > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[500px]">
              {recent.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recent.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        notif.status !== 'read' ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => {
                        if (notif.status !== 'read') {
                          markAsRead(notif.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Channel Icon */}
                        <div className={`p-2 rounded-lg ${channelColor(notif.channel)} text-white shrink-0`}>
                          {channelIcon(notif.channel)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {notif.title}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${priorityBadge(notif.priority)}`}>
                              {notif.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                            {notif.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                              Para: {notif.recipient.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {timeAgo(notif.createdAt)}
                            </p>
                          </div>
                          {notif.status !== 'read' && (
                            <div className="mt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notif.id);
                                }}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" /> Marcar como lida
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {recent.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => {
                    // Aqui iria para página completa de notificações
                    setIsOpen(false);
                  }}
                  className="w-full text-center text-sm text-primary hover:underline font-medium"
                >
                  Ver todas as notificações
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
