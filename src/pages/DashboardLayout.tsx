import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, PenTool, BookOpen, DollarSign, Menu, X, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../stores';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard/grading', label: 'Gabarito', icon: PenTool },
    { to: '/dashboard/ava', label: 'AVA', icon: BookOpen },
    { to: '/dashboard/finance', label: 'Financeiro', icon: DollarSign },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-gold" />
              <span className="text-lg font-bold text-white">SABER</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-6 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center">
                <User className="w-5 h-5 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'Usuário'}</p>
                <p className="text-xs text-white/50 truncate">{user?.email || ''}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Plano: <span className="font-semibold text-primary">SABER INTEGRAL</span></span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
