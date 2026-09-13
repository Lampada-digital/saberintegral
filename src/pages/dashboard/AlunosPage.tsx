import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Eye, Download, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/Modal';
import { Table } from '../../components/Table';
import { useStore, useToastStore, type Aluno } from '../../lib/store';
import { useEventBus } from '../../lib/eventBus';
import Papa from 'papaparse';

export const AlunosPage: React.FC = () => {
  const { alunos, turmas, addAluno, updateAluno, deleteAluno } = useStore();
  const { addToast } = useToastStore();
  const { emit } = useEventBus();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterTurma, setFilterTurma] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState(1);

  const [form, setForm] = useState<Partial<Aluno>>({
    status: 'ativo',
  });

  const resetForm = () => {
    setForm({ status: 'ativo' });
    setEditingId(null);
    setActiveTab(1);
  };

  const openCreate = () => { resetForm(); setShowModal(true); };
  
  const openEdit = (aluno: Aluno) => {
    setForm(aluno);
    setEditingId(aluno.id);
    setShowModal(true);
    setActiveTab(1);
  };

  const handleSave = async () => {
    if (!form.nome || !form.turmaId) {
      addToast('Preencha os campos obrigatórios (Nome e Turma)', 'error');
      return;
    }
    
    if (editingId) {
      updateAluno(editingId, form);
      addToast('Aluno atualizado com sucesso!', 'success');
      
      // Emitir evento de aluno atualizado
      await emit('aluno_atualizado', {
        entityId: editingId,
        entityName: form.nome,
        data: { ...form },
        priority: 'normal',
      });
    } else {
      const newAluno = { ...form, id: `aluno_${Date.now()}` } as Aluno;
      addAluno(form as Omit<Aluno, 'id'>);
      addToast('Aluno cadastrado com sucesso!', 'success');
      
      // Emitir evento de aluno criado (dispara cascata: mensalidade, notificações, etc)
      await emit('aluno_criado', {
        entityId: newAluno.id,
        entityName: form.nome,
        data: { ...form },
        priority: 'high',
      });
    }
    setShowModal(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    const aluno = alunos.find((a) => a.id === id);
    deleteAluno(id);
    addToast('Aluno excluído com sucesso', 'info');
    setShowDeleteConfirm(null);
    
    // Emitir evento de aluno excluído
    await emit('aluno_excluido', {
      entityId: id,
      entityName: aluno?.nome,
      data: { alunoId: id },
      priority: 'high',
    });
  };

  const handleExportCSV = () => {
    const csv = Papa.unparse(filtered.map(a => ({
      Nome: a.nome,
      Email: a.email,
      Turma: getTurmaNome(a.turmaId),
      Responsável: a.responsavel,
      Telefone: a.telefone,
      Status: a.status,
    })));
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alunos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    addToast('Lista exportada com sucesso!', 'success');
  };

  const filtered = alunos.filter((a) => {
    const matchSearch = a.nome.toLowerCase().includes(search.toLowerCase()) || 
                       a.responsavel?.toLowerCase().includes(search.toLowerCase()) ||
                       a.email?.toLowerCase().includes(search.toLowerCase());
    const matchTurma = !filterTurma || a.turmaId === filterTurma;
    const matchStatus = !filterStatus || a.status === filterStatus;
    return matchSearch && matchTurma && matchStatus;
  });

  const getTurmaNome = (id: string) => turmas.find((t) => t.id === id)?.nome || '-';

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Alunos</h1>
          <p className="text-sm text-gray-500">{alunos.length} aluno(s) cadastrado(s)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" /> Exportar
          </Button>
          <Button variant="gold" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" /> Novo Aluno
          </Button>
        </div>
      </div>

      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome, email ou responsável..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
            />
          </div>
          <select value={filterTurma} onChange={(e) => setFilterTurma(e.target.value)} className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm">
            <option value="">Todas as turmas</option>
            {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm">
            <option value="">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="transferido">Transferido</option>
          </select>
        </div>
      </Card>

      <Card padding={false}>
        <Table
          columns={[
            { key: 'nome', header: 'Nome', render: (a) => (
              <div>
                <span className="font-medium text-gray-800">{a.nome}</span>
                <p className="text-xs text-gray-500">{a.email}</p>
              </div>
            )},
            { key: 'turma', header: 'Turma', render: (a) => getTurmaNome(a.turmaId) },
            { key: 'responsavel', header: 'Responsável', className: 'hidden md:table-cell', render: (a) => a.responsavel || '-' },
            { key: 'telefone', header: 'Telefone', className: 'hidden lg:table-cell', render: (a) => a.telefone || '-' },
            { key: 'status', header: 'Status', render: (a) => (
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                a.status === 'ativo' ? 'bg-green-100 text-green-700' :
                a.status === 'inativo' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>{a.status}</span>
            )},
            { key: 'acoes', header: 'Ações', render: (a) => (
              <div className="flex gap-1">
                <button onClick={() => setShowProfile(a.id)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600" title="Ver perfil">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => openEdit(a)} className="p-1.5 rounded hover:bg-green-50 text-green-600" title="Editar">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => setShowDeleteConfirm(a.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="Excluir">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )},
          ]}
          data={filtered}
          keyExtractor={(a) => a.id}
        />
      </Card>

      {/* Modal de Criação/Edição */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Editar Aluno' : 'Novo Aluno'} size="xl">
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200 mb-4">
            {[
              { num: 1, label: 'Dados Pessoais' },
              { num: 2, label: 'Endereço' },
              { num: 3, label: 'Responsável' },
              { num: 4, label: 'Saúde' },
              { num: 5, label: 'Acadêmico' },
            ].map((tab) => (
              <button
                key={tab.num}
                onClick={() => setActiveTab(tab.num)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.num
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Dados Pessoais */}
          {activeTab === 1 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Nome Completo *" value={form.nome || ''} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              <Input label="Email" type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label="Data de Nascimento" type="date" value={form.dataNascimento || ''} onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })} />
              <Input label="CPF" value={form.cpf || ''} onChange={(e) => setForm({ ...form, cpf: e.target.value })} placeholder="000.000.000-00" />
              <Input label="RG" value={form.rg || ''} onChange={(e) => setForm({ ...form, rg: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sexo</label>
                <select value={form.sexo || ''} onChange={(e) => setForm({ ...form, sexo: e.target.value as any })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm">
                  <option value="">Selecione...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <Input label="Cor/Raça" value={form.corRaca || ''} onChange={(e) => setForm({ ...form, corRaca: e.target.value })} />
              <Input label="Naturalidade" value={form.naturalidade || ''} onChange={(e) => setForm({ ...form, naturalidade: e.target.value })} />
              <Input label="Nacionalidade" value={form.nacionalidade || ''} onChange={(e) => setForm({ ...form, nacionalidade: e.target.value })} />
              <Input label="Telefone" value={form.telefone || ''} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
              <Input label="Celular" value={form.celular || ''} onChange={(e) => setForm({ ...form, celular: e.target.value })} />
            </div>
          )}

          {/* Tab 2: Endereço */}
          {activeTab === 2 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="CEP" value={form.cep || ''} onChange={(e) => setForm({ ...form, cep: e.target.value })} />
              <Input label="Logradouro" value={form.logradouro || ''} onChange={(e) => setForm({ ...form, logradouro: e.target.value })} />
              <Input label="Número" value={form.numero || ''} onChange={(e) => setForm({ ...form, numero: e.target.value })} />
              <Input label="Complemento" value={form.complemento || ''} onChange={(e) => setForm({ ...form, complemento: e.target.value })} />
              <Input label="Bairro" value={form.bairro || ''} onChange={(e) => setForm({ ...form, bairro: e.target.value })} />
              <Input label="Cidade" value={form.cidade || ''} onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
              <Input label="Estado" value={form.estado || ''} onChange={(e) => setForm({ ...form, estado: e.target.value })} />
            </div>
          )}

          {/* Tab 3: Responsável */}
          {activeTab === 3 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Nome do Responsável" value={form.responsavel || ''} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} />
              <Input label="CPF do Responsável" value={form.responsavelCpf || ''} onChange={(e) => setForm({ ...form, responsavelCpf: e.target.value })} />
              <Input label="Telefone do Responsável" value={form.responsavelTelefone || ''} onChange={(e) => setForm({ ...form, responsavelTelefone: e.target.value })} />
              <Input label="Email do Responsável" type="email" value={form.responsavelEmail || ''} onChange={(e) => setForm({ ...form, responsavelEmail: e.target.value })} />
              <Input label="Parentesco" value={form.responsavelParentesco || ''} onChange={(e) => setForm({ ...form, responsavelParentesco: e.target.value })} />
              <Input label="Profissão" value={form.responsavelProfissao || ''} onChange={(e) => setForm({ ...form, responsavelProfissao: e.target.value })} />
            </div>
          )}

          {/* Tab 4: Saúde */}
          {activeTab === 4 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Tipo Sanguíneo" value={form.tipoSanguineo || ''} onChange={(e) => setForm({ ...form, tipoSanguineo: e.target.value })} placeholder="Ex: O+" />
              <Input label="Alergias" value={form.alergias || ''} onChange={(e) => setForm({ ...form, alergias: e.target.value })} />
              <Input label="Medicamentos" value={form.medicamentos || ''} onChange={(e) => setForm({ ...form, medicamentos: e.target.value })} />
              <Input label="Plano de Saúde" value={form.planoSaude || ''} onChange={(e) => setForm({ ...form, planoSaude: e.target.value })} />
              <Input label="Contato de Emergência" value={form.contatoEmergencia || ''} onChange={(e) => setForm({ ...form, contatoEmergencia: e.target.value })} />
            </div>
          )}

          {/* Tab 5: Acadêmico */}
          {activeTab === 5 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Turma *</label>
                <select value={form.turmaId || ''} onChange={(e) => setForm({ ...form, turmaId: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm">
                  <option value="">Selecione...</option>
                  {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </div>
              <Input label="Data de Matrícula" type="date" value={form.dataMatricula || ''} onChange={(e) => setForm({ ...form, dataMatricula: e.target.value })} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select value={form.status || 'ativo'} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm">
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="transferido">Transferido</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Observações</label>
                <textarea 
                  value={form.observacoes || ''} 
                  onChange={(e) => setForm({ ...form, observacoes: e.target.value })} 
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                  placeholder="Observações gerais sobre o aluno..."
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="gold" onClick={handleSave} className="flex-1">Salvar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Perfil */}
      <Modal isOpen={!!showProfile} onClose={() => setShowProfile(null)} title="Perfil do Aluno" size="xl">
        {showProfile && (() => {
          const aluno = alunos.find((a) => a.id === showProfile);
          if (!aluno) return null;
          
          return (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Dados Pessoais</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-500">Nome:</span> {aluno.nome}</p>
                    <p><span className="text-gray-500">Email:</span> {aluno.email}</p>
                    <p><span className="text-gray-500">Nascimento:</span> {aluno.dataNascimento ? new Date(aluno.dataNascimento).toLocaleDateString('pt-BR') : '-'}</p>
                    <p><span className="text-gray-500">CPF:</span> {aluno.cpf || '-'}</p>
                    <p><span className="text-gray-500">Telefone:</span> {aluno.telefone || '-'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Dados Acadêmicos</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-500">Turma:</span> {getTurmaNome(aluno.turmaId)}</p>
                    <p><span className="text-gray-500">Status:</span> {aluno.status}</p>
                    <p><span className="text-gray-500">Matrícula:</span> {aluno.dataMatricula ? new Date(aluno.dataMatricula).toLocaleDateString('pt-BR') : '-'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Responsável</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Nome:</span> {aluno.responsavel || '-'}</p>
                  <p><span className="text-gray-500">Telefone:</span> {aluno.responsavelTelefone || '-'}</p>
                  <p><span className="text-gray-500">Email:</span> {aluno.responsavelEmail || '-'}</p>
                </div>
              </div>

              {aluno.observacoes && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Observações</h4>
                  <p className="text-sm text-gray-600">{aluno.observacoes}</p>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Confirmar Exclusão" size="sm">
        <p className="text-gray-600 mb-6">Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)}>Cancelar</Button>
          <Button variant="primary" onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700">Excluir</Button>
        </div>
      </Modal>
    </div>
  );
};
