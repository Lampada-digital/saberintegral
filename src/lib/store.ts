import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// ============ INTERFACES ============
export interface Aluno {
  id: string;
  nome: string;
  email: string;
  turmaId: string;
  responsavel: string;
  telefone: string;
  dataNascimento: string;
  status: 'ativo' | 'inativo';
}

export interface Turma {
  id: string;
  nome: string;
  serie: string;
  turno: 'manhã' | 'tarde' | 'integral';
  professorResponsavelId: string;
}

export interface Professor {
  id: string;
  nome: string;
  email: string;
  disciplina: string;
  telefone: string;
}

export interface Mensalidade {
  id: string;
  alunoId: string;
  alunoNome: string;
  valor: number;
  vencimento: string;
  status: 'pago' | 'pendente' | 'atrasado';
}

export interface MaterialAVA {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'video' | 'pdf' | 'atividade' | 'quiz';
  turmaId: string;
  disciplina: string;
  url: string;
  conteudo: string;
}

export interface Questao {
  numero: number;
  gabarito: string;
  peso: number;
  bncc: string;
}

export interface NotaAluno {
  alunoId: string;
  alunoNome: string;
  respostas: string[];
  nota: number;
  erros: number[];
  dataCorrecao: string;
}

export interface GabaritoProva {
  id: string;
  titulo: string;
  turmaId: string;
  disciplina: string;
  data: string;
  questoes: Questao[];
  notas: NotaAluno[];
}

export interface FeedbackIA {
  nota: number;
  feedback: string;
  pontosFortes: string[];
  pontosMelhorar: string[];
  errosGramaticais: string[];
}

export interface Redacao {
  id: string;
  alunoId: string;
  alunoNome: string;
  titulo: string;
  texto: string;
  nota: number;
  feedbackIA: FeedbackIA;
  data: string;
}

export interface ConfigEscola {
  logo: string;
  corPrimaria: string;
  corSecundaria: string;
  nomeEscola: string;
  dominio: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  escola: string;
}

// ============ STORE ============
interface StoreState {
  // Auth
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => boolean;
  register: (nome: string, email: string, escola: string, senha: string) => boolean;
  logout: () => void;

  // Alunos
  alunos: Aluno[];
  addAluno: (aluno: Omit<Aluno, 'id'>) => void;
  updateAluno: (id: string, data: Partial<Aluno>) => void;
  deleteAluno: (id: string) => void;

  // Turmas
  turmas: Turma[];
  addTurma: (turma: Omit<Turma, 'id'>) => void;
  updateTurma: (id: string, data: Partial<Turma>) => void;
  deleteTurma: (id: string) => void;

  // Professores
  professores: Professor[];
  addProfessor: (prof: Omit<Professor, 'id'>) => void;
  updateProfessor: (id: string, data: Partial<Professor>) => void;
  deleteProfessor: (id: string) => void;

  // Mensalidades
  mensalidades: Mensalidade[];
  addMensalidade: (m: Omit<Mensalidade, 'id'>) => void;
  updateMensalidade: (id: string, data: Partial<Mensalidade>) => void;
  gerarMensalidades: (mes: string) => void;

  // AVA
  materiaisAVA: MaterialAVA[];
  addMaterialAVA: (m: Omit<MaterialAVA, 'id'>) => void;
  updateMaterialAVA: (id: string, data: Partial<MaterialAVA>) => void;
  deleteMaterialAVA: (id: string) => void;

  // Gabaritos
  gabaritos: GabaritoProva[];
  addGabarito: (g: Omit<GabaritoProva, 'id' | 'notas'>) => void;
  updateGabarito: (id: string, data: Partial<GabaritoProva>) => void;
  deleteGabarito: (id: string) => void;
  corrigirProva: (gabaritoId: string, alunoId: string, respostas: string[]) => NotaAluno;

  // Redações
  redacoes: Redacao[];
  addRedacao: (r: Omit<Redacao, 'id' | 'data'>) => void;
  deleteRedacao: (id: string) => void;

  // Config
  schoolConfig: ConfigEscola;
  updateSchoolConfig: (config: Partial<ConfigEscola>) => void;
}

// ============ SEED DATA ============
const seedAlunos: Aluno[] = [
  { id: 'a1', nome: 'Maria Silva Santos', email: 'maria@email.com', turmaId: 't1', responsavel: 'Ana Silva', telefone: '(11) 98765-4321', dataNascimento: '2010-03-15', status: 'ativo' },
  { id: 'a2', nome: 'João Pedro Oliveira', email: 'joao@email.com', turmaId: 't1', responsavel: 'Carlos Oliveira', telefone: '(11) 91234-5678', dataNascimento: '2010-07-22', status: 'ativo' },
  { id: 'a3', nome: 'Ana Beatriz Costa', email: 'ana@email.com', turmaId: 't1', responsavel: 'Paula Costa', telefone: '(11) 99876-5432', dataNascimento: '2011-01-10', status: 'ativo' },
  { id: 'a4', nome: 'Lucas Ferreira Lima', email: 'lucas@email.com', turmaId: 't2', responsavel: 'Roberto Lima', telefone: '(11) 92345-6789', dataNascimento: '2009-11-05', status: 'ativo' },
  { id: 'a5', nome: 'Isabela Rodrigues', email: 'isabela@email.com', turmaId: 't2', responsavel: 'Fernanda Rodrigues', telefone: '(11) 93456-7890', dataNascimento: '2009-05-18', status: 'inativo' },
];

const seedTurmas: Turma[] = [
  { id: 't1', nome: '6º Ano A', serie: '6º Ano', turno: 'manhã', professorResponsavelId: 'p1' },
  { id: 't2', nome: '7º Ano B', serie: '7º Ano', turno: 'tarde', professorResponsavelId: 'p2' },
];

const seedProfessores: Professor[] = [
  { id: 'p1', nome: 'Prof. Ricardo Mendes', email: 'ricardo@escola.com', disciplina: 'Matemática', telefone: '(11) 98111-2222' },
  { id: 'p2', nome: 'Prof. Juliana Alves', email: 'juliana@escola.com', disciplina: 'Português', telefone: '(11) 98222-3333' },
  { id: 'p3', nome: 'Prof. Marcos Souza', email: 'marcos@escola.com', disciplina: 'Ciências', telefone: '(11) 98333-4444' },
];

const seedMensalidades: Mensalidade[] = [
  { id: 'm1', alunoId: 'a1', alunoNome: 'Maria Silva Santos', valor: 850, vencimento: '2026-01-10', status: 'pago' },
  { id: 'm2', alunoId: 'a2', alunoNome: 'João Pedro Oliveira', valor: 850, vencimento: '2026-01-10', status: 'pago' },
  { id: 'm3', alunoId: 'a3', alunoNome: 'Ana Beatriz Costa', valor: 850, vencimento: '2026-02-10', status: 'pendente' },
  { id: 'm4', alunoId: 'a4', alunoNome: 'Lucas Ferreira Lima', valor: 950, vencimento: '2026-02-10', status: 'pendente' },
  { id: 'm5', alunoId: 'a5', alunoNome: 'Isabela Rodrigues', valor: 950, vencimento: '2025-12-10', status: 'atrasado' },
];

const seedMateriais: MaterialAVA[] = [
  { id: 'mat1', titulo: 'Introdução à Álgebra', descricao: 'Vídeo aula sobre conceitos básicos de álgebra', tipo: 'video', turmaId: 't1', disciplina: 'Matemática', url: 'https://youtube.com/exemplo', conteudo: '' },
  { id: 'mat2', titulo: 'Interpretação de Texto', descricao: 'PDF com exercícios de interpretação', tipo: 'pdf', turmaId: 't1', disciplina: 'Português', url: '', conteudo: 'Exercícios de interpretação de texto narrativo...' },
  { id: 'mat3', titulo: 'Quiz de Ciências', descricao: 'Quiz interativo sobre sistema solar', tipo: 'quiz', turmaId: 't2', disciplina: 'Ciências', url: '', conteudo: 'Perguntas sobre o sistema solar' },
];

const seedGabaritos: GabaritoProva[] = [
  {
    id: 'g1',
    titulo: 'Prova de Matemática - 1º Bimestre',
    turmaId: 't1',
    disciplina: 'Matemática',
    data: '2026-03-15',
    questoes: [
      { numero: 1, gabarito: 'B', peso: 2, bncc: 'EF06MA01' },
      { numero: 2, gabarito: 'C', peso: 2, bncc: 'EF06MA02' },
      { numero: 3, gabarito: 'A', peso: 2, bncc: 'EF06MA03' },
      { numero: 4, gabarito: 'D', peso: 2, bncc: 'EF06MA04' },
      { numero: 5, gabarito: 'B', peso: 2, bncc: 'EF06MA05' },
    ],
    notas: [
      { alunoId: 'a1', alunoNome: 'Maria Silva Santos', respostas: ['B', 'C', 'A', 'D', 'B'], nota: 10, erros: [], dataCorrecao: '2026-03-16' },
      { alunoId: 'a2', alunoNome: 'João Pedro Oliveira', respostas: ['B', 'A', 'A', 'C', 'B'], nota: 6, erros: [2, 4], dataCorrecao: '2026-03-16' },
    ],
  },
  {
    id: 'g2',
    titulo: 'Prova de Português - 1º Bimestre',
    turmaId: 't2',
    disciplina: 'Português',
    data: '2026-03-20',
    questoes: [
      { numero: 1, gabarito: 'A', peso: 2, bncc: 'EF07LP01' },
      { numero: 2, gabarito: 'D', peso: 2, bncc: 'EF07LP02' },
      { numero: 3, gabarito: 'C', peso: 2, bncc: 'EF07LP03' },
      { numero: 4, gabarito: 'B', peso: 2, bncc: 'EF07LP04' },
    ],
    notas: [
      { alunoId: 'a4', alunoNome: 'Lucas Ferreira Lima', respostas: ['A', 'D', 'C', 'B'], nota: 10, erros: [], dataCorrecao: '2026-03-21' },
    ],
  },
];

// ============ TOAST STORE ============
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  addToast: (message, type) => {
    const id = Date.now().toString() + Math.random();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// ============ STORE IMPLEMENTATION ============
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      usuario: null,
      isAuthenticated: false,
      login: (email, senha) => {
        const state = get();
        if (email && senha.length >= 6) {
          set({
            usuario: { id: 'u1', nome: email.split('@')[0], email, escola: state.schoolConfig.nomeEscola || 'Minha Escola' },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },
      register: (nome, email, escola, senha) => {
        if (nome && email && escola && senha.length >= 6) {
          set({
            usuario: { id: uuidv4(), nome, email, escola },
            isAuthenticated: true,
            schoolConfig: { ...get().schoolConfig, nomeEscola: escola },
          });
          return true;
        }
        return false;
      },
      logout: () => set({ usuario: null, isAuthenticated: false }),

      // Alunos
      alunos: seedAlunos,
      addAluno: (aluno) => set((s) => ({ alunos: [...s.alunos, { ...aluno, id: uuidv4() }] })),
      updateAluno: (id, data) => set((s) => ({ alunos: s.alunos.map((a) => (a.id === id ? { ...a, ...data } : a)) })),
      deleteAluno: (id) => set((s) => ({ alunos: s.alunos.filter((a) => a.id !== id) })),

      // Turmas
      turmas: seedTurmas,
      addTurma: (turma) => set((s) => ({ turmas: [...s.turmas, { ...turma, id: uuidv4() }] })),
      updateTurma: (id, data) => set((s) => ({ turmas: s.turmas.map((t) => (t.id === id ? { ...t, ...data } : t)) })),
      deleteTurma: (id) => set((s) => ({ turmas: s.turmas.filter((t) => t.id !== id) })),

      // Professores
      professores: seedProfessores,
      addProfessor: (prof) => set((s) => ({ professores: [...s.professores, { ...prof, id: uuidv4() }] })),
      updateProfessor: (id, data) => set((s) => ({ professores: s.professores.map((p) => (p.id === id ? { ...p, ...data } : p)) })),
      deleteProfessor: (id) => set((s) => ({ professores: s.professores.filter((p) => p.id !== id) })),

      // Mensalidades
      mensalidades: seedMensalidades,
      addMensalidade: (m) => set((s) => ({ mensalidades: [...s.mensalidades, { ...m, id: uuidv4() }] })),
      updateMensalidade: (id, data) => set((s) => ({ mensalidades: s.mensalidades.map((m) => (m.id === id ? { ...m, ...data } : m)) })),
      gerarMensalidades: (mes) => {
        const state = get();
        const alunosAtivos = state.alunos.filter((a) => a.status === 'ativo');
        const novas = alunosAtivos.map((aluno) => ({
          id: uuidv4(),
          alunoId: aluno.id,
          alunoNome: aluno.nome,
          valor: 850,
          vencimento: `${mes}-10`,
          status: 'pendente' as const,
        }));
        set((s) => ({ mensalidades: [...s.mensalidades, ...novas] }));
      },

      // AVA
      materiaisAVA: seedMateriais,
      addMaterialAVA: (m) => set((s) => ({ materiaisAVA: [...s.materiaisAVA, { ...m, id: uuidv4() }] })),
      updateMaterialAVA: (id, data) => set((s) => ({ materiaisAVA: s.materiaisAVA.map((m) => (m.id === id ? { ...m, ...data } : m)) })),
      deleteMaterialAVA: (id) => set((s) => ({ materiaisAVA: s.materiaisAVA.filter((m) => m.id !== id) })),

      // Gabaritos
      gabaritos: seedGabaritos,
      addGabarito: (g) => set((s) => ({ gabaritos: [...s.gabaritos, { ...g, id: uuidv4(), notas: [] }] })),
      updateGabarito: (id, data) => set((s) => ({ gabaritos: s.gabaritos.map((g) => (g.id === id ? { ...g, ...data } : g)) })),
      deleteGabarito: (id) => set((s) => ({ gabaritos: s.gabaritos.filter((g) => g.id !== id) })),
      corrigirProva: (gabaritoId, alunoId, respostas) => {
        const state = get();
        const gabarito = state.gabaritos.find((g) => g.id === gabaritoId);
        const aluno = state.alunos.find((a) => a.id === alunoId);
        if (!gabarito || !aluno) throw new Error('Gabarito ou aluno não encontrado');

        let pontosAcertados = 0;
        let pontosTotais = 0;
        const erros: number[] = [];

        gabarito.questoes.forEach((q, idx) => {
          pontosTotais += q.peso;
          if (respostas[idx]?.toUpperCase() === q.gabarito) {
            pontosAcertados += q.peso;
          } else {
            erros.push(q.numero);
          }
        });

        const nota = pontosTotais > 0 ? (pontosAcertados / pontosTotais) * 10 : 0;
        const notaArredondada = Math.round(nota * 10) / 10;

        const notaAluno: NotaAluno = {
          alunoId,
          alunoNome: aluno.nome,
          respostas,
          nota: notaArredondada,
          erros,
          dataCorrecao: new Date().toISOString().split('T')[0],
        };

        set((s) => ({
          gabaritos: s.gabaritos.map((g) =>
            g.id === gabaritoId
              ? { ...g, notas: [...g.notas.filter((n) => n.alunoId !== alunoId), notaAluno] }
              : g
          ),
        }));

        return notaAluno;
      },

      // Redações
      redacoes: [],
      addRedacao: (r) => set((s) => ({ redacoes: [...s.redacoes, { ...r, id: uuidv4(), data: new Date().toISOString().split('T')[0] }] })),
      deleteRedacao: (id) => set((s) => ({ redacoes: s.redacoes.filter((r) => r.id !== id) })),

      // Config
      schoolConfig: {
        logo: '',
        corPrimaria: '#1E3A5F',
        corSecundaria: '#C59D2C',
        nomeEscola: 'Minha Escola',
        dominio: 'minhaescola',
      },
      updateSchoolConfig: (config) => set((s) => ({ schoolConfig: { ...s.schoolConfig, ...config } })),
    }),
    {
      name: 'saber-integral-storage',
    }
  )
);
