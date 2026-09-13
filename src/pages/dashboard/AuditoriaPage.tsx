import React, { useState } from 'react';
import { Activity, Filter, Trash2, Download, Eye } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/Modal';
import { useEventBus, type EventPayload } from '../../lib/eventBus';

export const AuditoriaPage: React.FC = () => {
  const { eventLog, totalEventsEmitted, eventsByType, clearLog } = useEventBus();
  const [filter, setFilter] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<EventPayload | null>(null);

  const filteredLog = filter
    ? eventLog.filter((e) => e.entityType === filter || e.eventName.includes(filter))
    : eventLog;

  const topEvents = Object.entries(eventsByType)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const priorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-700',
      normal: 'bg-blue-100 text-blue-700',
      high: 'bg-yellow-100 text-yellow-700',
      critical: 'bg-red-100 text-red-700',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const handleExport = () => {
    const data = JSON.stringify(eventLog, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `event-log-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Auditoria de Eventos
          </h1>
          <p className="text-sm text-gray-500">
            Log completo de todas as ações do sistema em tempo real
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Exportar
          </Button>
          <Button variant="primary" onClick={() => {
            if (confirm('Limpar todo o log de eventos?')) {
              clearLog();
            }
          }}>
            <Trash2 className="w-4 h-4 mr-2" /> Limpar Log
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="text-xs text-gray-500">Total de Eventos</p>
          <p className="text-3xl font-bold text-primary">{totalEventsEmitted}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500">Eventos no Log</p>
          <p className="text-3xl font-bold text-primary">{eventLog.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500">Tipos Únicos</p>
          <p className="text-3xl font-bold text-primary">{Object.keys(eventsByType).length}</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500">Último Evento</p>
          <p className="text-sm font-medium text-gray-800 truncate">
            {eventLog[0] ? new Date(eventLog[0].timestamp).toLocaleTimeString('pt-BR') : '-'}
          </p>
        </Card>
      </div>

      {/* Top Events */}
      {topEvents.length > 0 && (
        <Card>
          <h3 className="font-bold text-gray-800 mb-4">📊 Eventos Mais Frequentes</h3>
          <div className="space-y-2">
            {topEvents.map(([eventName, count]) => (
              <div key={eventName} className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-700">{eventName}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(count / topEvents[0][1]) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-primary w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filter */}
      <Card>
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Filtrar por tipo de evento (ex: aluno, nota, financeiro)..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {filter && (
            <Button variant="ghost" size="sm" onClick={() => setFilter('')}>
              Limpar
            </Button>
          )}
        </div>
      </Card>

      {/* Event Log */}
      <Card padding={false}>
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">
            📜 Log de Eventos ({filteredLog.length})
          </h3>
        </div>
        
        {filteredLog.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum evento registrado ainda</p>
            <p className="text-sm text-gray-400 mt-1">
              As ações do sistema aparecerão aqui em tempo real
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filteredLog.map((event) => (
              <div
                key={event.eventId}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-semibold text-primary">
                        {event.eventName}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor(event.priority)}`}>
                        {event.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 truncate">
                      {event.entityName || event.entityId || 'Sistema'}
                    </p>
                    {event.userName && (
                      <p className="text-xs text-gray-500 mt-1">
                        por {event.userName}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">
                      {new Date(event.timestamp).toLocaleString('pt-BR')}
                    </p>
                    <button className="text-primary hover:text-primary-light mt-1">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Event Detail Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Detalhes do Evento"
        size="lg"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Event ID</p>
                <p className="text-sm font-mono text-gray-800">{selectedEvent.eventId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Timestamp</p>
                <p className="text-sm text-gray-800">
                  {new Date(selectedEvent.timestamp).toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Event Name</p>
                <p className="text-sm font-mono font-semibold text-primary">
                  {selectedEvent.eventName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Priority</p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColor(selectedEvent.priority)}`}>
                  {selectedEvent.priority}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Entity Type</p>
                <p className="text-sm text-gray-800">{selectedEvent.entityType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Entity ID</p>
                <p className="text-sm font-mono text-gray-800">{selectedEvent.entityId}</p>
              </div>
              {selectedEvent.entityName && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Entity Name</p>
                  <p className="text-sm text-gray-800">{selectedEvent.entityName}</p>
                </div>
              )}
              {selectedEvent.userName && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">User</p>
                  <p className="text-sm text-gray-800">
                    {selectedEvent.userName} ({selectedEvent.userId})
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Payload Data</p>
              <pre className="bg-gray-50 rounded-lg p-4 text-xs overflow-x-auto">
                {JSON.stringify(selectedEvent.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
