import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, Users, School, UserCheck, DollarSign, BookOpen, PenTool, FileText, Settings, Menu, X, LogOut, GraduationCap as StudentIcon } from 'lucide-react';
import { useStore, useToastStore } from '../../lib/store';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { usuario, schoolConfig, logout } = useStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/dashboard/alunos', label: 'Alunos', icon: Users },
    { to: '/dashboard/turmas', label: 'Turmas', icon: School },
    { to: '/dashboard/professores', label: 'Professores', icon: UserCheck },
    { to: '/dashboard/financeiro', label: 'Financeiro', icon: DollarSign },
    { to: '/dashboard/ava', label: 'AVA', icon: BookOpen },
    { to: '/dashboard/gabarito', label: 'Gabarito', icon: PenTool },
    { to: '/dashboard/redacoes', label: 'Redações', icon: FileText },
    { to: '/dashboard/configuracoes', label: 'Configurações', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    addToast('Logout realizado', 'info');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{ backgroundColor: schoolConfig.corPrimaria }}>
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              {schoolConfig.logo ? (
                <img src={schoolConfig.logo} alt="Logo" className="w-8 h-8 rounded" />
              ) : (
                <GraduationCap className="w-7 h-7 text-gold" />
              )}
              <span className="text-sm font-bold text-white truncate">{schoolConfig.nomeEscola || 'SABER'}</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                {usuario?.nome?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{usuario?.nome || 'Usuário'}</p>
                <p className="text-xs text-white/50 truncate">{usuario?.email || ''}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="hidden lg:block text-sm text-gray-500">
            <span className="font-medium text-primary">{schoolConfig.nomeEscola}</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/portal')} 
              className="text-sm font-medium text-primary hover:text-primary-light transition-colors hidden sm:block"
            >
              Portal do Aluno
            </button>
            <span className="text-sm text-gray-500 hidden sm:block">Plano: <span className="font-semibold text-gold">SABER INTEGRAL</span></span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
