import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type) => {
    const id = Date.now().toString();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

interface AuthStore {
  user: { email: string; name: string } | null;
  isAuthenticated: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email, name) => set({ user: { email, name }, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

interface OnboardingStore {
  step: number;
  logo: string | null;
  logoName: string | null;
  primaryColor: string;
  secondaryColor: string;
  subdomain: string;
  setStep: (step: number) => void;
  setLogo: (logo: string | null, name: string | null) => void;
  setColors: (primary: string, secondary: string) => void;
  setSubdomain: (subdomain: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  step: 1,
  logo: null,
  logoName: null,
  primaryColor: '#1E3A5F',
  secondaryColor: '#C59D2C',
  subdomain: '',
  setStep: (step) => set({ step }),
  setLogo: (logo, name) => set({ logo, logoName: name }),
  setColors: (primary, secondary) => set({ primaryColor: primary, secondaryColor: secondary }),
  setSubdomain: (subdomain) => set({ subdomain }),
  reset: () => set({ step: 1, logo: null, logoName: null, primaryColor: '#1E3A5F', secondaryColor: '#C59D2C', subdomain: '' }),
}));

interface Question {
  id: string;
  number: number;
  answer: string;
  weight: number;
  bncc: string;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  questions: Question[];
  createdAt: string;
}

interface GradingStore {
  exams: Exam[];
  addExam: (exam: Exam) => void;
  removeExam: (id: string) => void;
}

export const useGradingStore = create<GradingStore>((set) => ({
  exams: [],
  addExam: (exam) => set((state) => ({ exams: [...state.exams, exam] })),
  removeExam: (id) => set((state) => ({ exams: state.exams.filter((e) => e.id !== id) })),
}));

interface Trail {
  id: string;
  title: string;
  description: string;
  subject: string;
  files: string[];
  createdAt: string;
}

interface AvaStore {
  trails: Trail[];
  addTrail: (trail: Trail) => void;
  removeTrail: (id: string) => void;
}

export const useAvaStore = create<AvaStore>((set) => ({
  trails: [],
  addTrail: (trail) => set((state) => ({ trails: [...state.trails, trail] })),
  removeTrail: (id) => set((state) => ({ trails: state.trails.filter((t) => t.id !== id) })),
}));

interface Student {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'ativo' | 'pendente' | 'inadimplente';
}

interface Charge {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  status: 'pago' | 'pendente';
  createdAt: string;
}

interface FinanceStore {
  students: Student[];
  charges: Charge[];
  addStudent: (student: Student) => void;
  addCharge: (charge: Charge) => void;
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  students: [
    { id: '1', name: 'Maria Silva', email: 'maria@email.com', plan: 'Premium', status: 'ativo' },
    { id: '2', name: 'João Santos', email: 'joao@email.com', plan: 'Básico', status: 'pendente' },
    { id: '3', name: 'Ana Oliveira', email: 'ana@email.com', plan: 'Premium', status: 'ativo' },
    { id: '4', name: 'Pedro Costa', email: 'pedro@email.com', plan: 'Básico', status: 'inadimplente' },
  ],
  charges: [],
  addStudent: (student) => set((state) => ({ students: [...state.students, student] })),
  addCharge: (charge) => set((state) => ({ charges: [...state.charges, charge] })),
}));
