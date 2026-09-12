import React, { useState } from 'react';
import { DollarSign, Plus, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useFinanceStore, useToastStore } from '../../stores';
import { v4 as uuidv4 } from 'uuid';

export const FinancePage: React.FC = () => {
  const { students, charges, addCharge } = useFinanceStore();
  const { addToast } = useToastStore();
  const [generatingCharge, setGeneratingCharge] = useState<string | null>(null);

  const totalRevenue = charges.filter((c) => c.status === 'pago').reduce((acc, c) => acc + c.amount, 0);
  const pendingAmount = charges.filter((c) => c.status === 'pendente').reduce((acc, c) => acc + c.amount, 0);
  const activeStudents = students.filter((s) => s.status === 'ativo').length;

  const handleGenerateCharge = async (studentId: string, studentName: string) => {
    setGeneratingCharge(studentId);
    await new Promise((r) => setTimeout(r, 1500));
    
    const charge = {
      id: uuidv4(),
      studentId,
      studentName,
      amount: 299,
      status: 'pendente' as const,
      createdAt: new Date().toISOString(),
    };
    addCharge(charge);
    setGeneratingCharge(null);
    addToast(`Cobrança de R$ 299,00 gerada para ${studentName}`, 'success');
  };



  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Módulo Financeiro</h1>
        <p className="text-sm text-gray-500">Gerencie alunos, cobranças e acompanhe o faturamento</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Receita Total</p>
              <p className="text-lg font-bold text-gray-800">R$ {totalRevenue.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pendente</p>
              <p className="text-lg font-bold text-gray-800">R$ {pendingAmount.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Alunos Ativos</p>
              <p className="text-lg font-bold text-gray-800">{activeStudents}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Cobranças</p>
              <p className="text-lg font-bold text-gray-800">{charges.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Students Table */}
      <Card className="mb-6">
        <h3 className="font-bold text-gray-800 mb-4">Alunos</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Nome</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">E-mail</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Plano</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">Ação</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{student.name}</td>
                  <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{student.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      student.plan === 'Premium' ? 'bg-gold/10 text-gold-dark' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {student.plan}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      student.status === 'ativo' ? 'bg-green-100 text-green-700' :
                      student.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGenerateCharge(student.id, student.name)}
                      loading={generatingCharge === student.id}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Cobrança
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Charges History */}
      {charges.length > 0 && (
        <Card>
          <h3 className="font-bold text-gray-800 mb-4">Histórico de Cobranças</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Aluno</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Valor</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Data</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {charges.map((charge) => (
                  <tr key={charge.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{charge.studentName}</td>
                    <td className="py-3 px-4 text-gray-600">R$ {charge.amount.toLocaleString('pt-BR')}</td>
                    <td className="py-3 px-4 text-gray-500">{new Date(charge.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        charge.status === 'pago' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {charge.status === 'pago' ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
