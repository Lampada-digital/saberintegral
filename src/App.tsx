import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { AlunosPage } from './pages/dashboard/AlunosPage';
import { TurmasPage } from './pages/dashboard/TurmasPage';
import { ProfessoresPage } from './pages/dashboard/ProfessoresPage';
import { FinanceiroPage } from './pages/dashboard/FinanceiroPage';
import { AvaPage } from './pages/dashboard/AvaPage';
import { GabaritoPage } from './pages/dashboard/GabaritoPage';
import { RedacoesPage } from './pages/dashboard/RedacoesPage';
import { ConfiguracoesPage } from './pages/dashboard/ConfiguracoesPage';
import { ToastContainer } from './components/Toast';
import { useStore } from './lib/store';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="alunos" element={<AlunosPage />} />
          <Route path="turmas" element={<TurmasPage />} />
          <Route path="professores" element={<ProfessoresPage />} />
          <Route path="financeiro" element={<FinanceiroPage />} />
          <Route path="ava" element={<AvaPage />} />
          <Route path="gabarito" element={<GabaritoPage />} />
          <Route path="redacoes" element={<RedacoesPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
