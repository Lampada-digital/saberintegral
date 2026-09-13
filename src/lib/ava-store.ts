import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// ============ INTERFACES ============
export interface Questao {
  id: string;
  enunciado: string;
  alternativas: string[];
  gabarito: number;
  bncc: string;
}

export interface Quiz {
  id: string;
  titulo: string;
  questoes: Questao[];
  tempoLimite?: number;
  tentativasPermitidas: number;
}

export interface EntregaTarefa {
  id: string;
  alunoId: string;
  alunoNome: string;
  tarefaId: string;
  conteudo: string;
  arquivos: string[];
  dataEntrega: string;
  nota?: number;
  feedback?: string;
  status: 'pendente' | 'corrigido';
}

export interface Aula {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'video' | 'pdf' | 'quiz' | 'tarefa' | 'link' | 'apresentacao';
  url?: string;
  conteudo?: string;
  duracao: number;
  ordem: number;
  liberacao: string;
  visibilidade: 'disponivel' | 'programado' | 'oculto';
  quiz?: Quiz;
  tarefa?: {
    descricao: string;
    prazo: string;
    valorMaximo: number;
    rubrica: string;
  };
  linkExterno?: string;
  materiais?: { nome: string; url: string }[];
  transcricao?: string;
  resumoIA?: string[];
}

export interface Modulo {
  id: string;
  nome: string;
  descricao: string;
  ordem: number;
  aulas: Aula[];
}

export interface Trilha {
  id: string;
  nome: string;
  descricao: string;
  turmaId: string;
  disciplina: string;
  cor: string;
  thumbnail: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  certificado: boolean;
  modulos: Modulo[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface Anotacao {
  id: string;
  aulaId: string;
  alunoId: string;
  texto: string;
  timestamp: number;
  criadoEm: string;
}

export interface Comentario {
  id: string;
  aulaId: string;
  alunoId: string;
  alunoNome: string;
  texto: string;
  criadoEm: string;
  respostas?: Comentario[];
}

export interface ProgressoAluno {
  id: string;
  alunoId: string;
  trilhaId: string;
  aulasConcluidas: string[];
  ultimaAula: string | null;
  progresso: number;
  tempoTotalEstudo: number;
  anotacoes: Anotacao[];
  comentarios: Comentario[];
  conquistas: string[];
  dataInicio: string;
  dataConclusao?: string;
}

export interface Conquista {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
}

export interface Midia {
  id: string;
  titulo: string;
  tipo: 'video' | 'pdf' | 'apresentacao';
  url: string;
  thumbnail?: string;
  duracao?: number;
  criadoEm: string;
  tags: string[];
}

// ============ DADOS INICIAIS (SEED) ============
const conquistasSeed: Conquista[] = [
  { id: 'c1', nome: 'Primeira Aula', descricao: 'Concluiu a primeira aula', icone: '🎯', cor: '#10B981' },
  { id: 'c2', nome: 'Mestre do Módulo', descricao: 'Completou um módulo inteiro', icone: '🏆', cor: '#F59E0B' },
  { id: 'c3', nome: 'Trilha Completa', descricao: 'Concluiu uma trilha inteira', icone: '🎓', cor: '#8B5CF6' },
  { id: 'c4', nome: '7 Dias Seguidos', descricao: 'Estudou 7 dias seguidos', icone: '🔥', cor: '#EF4444' },
  { id: 'c5', nome: 'Quiz Perfeito', descricao: 'Acertou 100% em um quiz', icone: '⭐', cor: '#F59E0B' },
];

const trilhasSeed: Trilha[] = [
  {
    id: 'trilha-1',
    nome: 'Matemática 6º Ano - 2026',
    descricao: 'Curso completo de matemática para o 6º ano com foco em números racionais',
    turmaId: 't1',
    disciplina: 'Matemática',
    cor: '#1E3A5F',
    thumbnail: '',
    nivel: 'Iniciante',
    certificado: true,
    modulos: [
      {
        id: 'mod-1-1',
        nome: 'Unidade 1: Números Racionais',
        descricao: 'Introdução às frações e números decimais',
        ordem: 1,
        aulas: [
          {
            id: 'aula-1-1-1',
            titulo: 'O que são frações?',
            descricao: 'Aula introdutória sobre o conceito de frações, numerador e denominador',
            tipo: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duracao: 720,
            ordem: 1,
            liberacao: '2026-01-15',
            visibilidade: 'disponivel',
            transcricao: 'Nesta aula vamos aprender sobre frações. Uma fração representa uma parte de um todo. O numerador é o número de cima e indica quantas partes temos. O denominador é o número de baixo e indica em quantas partes o todo foi dividido.',
            resumoIA: ['Definição de fração', 'Numerador e denominador', 'Exemplos práticos'],
          },
          {
            id: 'aula-1-1-2',
            titulo: 'Numerador e Denominador',
            descricao: 'Aprofundamento sobre os componentes das frações',
            tipo: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            duracao: 600,
            ordem: 2,
            liberacao: '2026-01-16',
            visibilidade: 'disponivel',
            transcricao: 'O numerador indica quantas partes foram selecionadas. O denominador mostra em quantas partes iguais o todo foi dividido.',
            resumoIA: ['Função do numerador', 'Função do denominador', 'Leitura de frações'],
          },
          {
            id: 'aula-1-1-3',
            titulo: 'Quiz: Frações Básicas',
            descricao: 'Teste seus conhecimentos sobre frações',
            tipo: 'quiz',
            duracao: 300,
            ordem: 3,
            liberacao: '2026-01-17',
            visibilidade: 'disponivel',
            quiz: {
              id: 'quiz-1',
              titulo: 'Quiz de Frações',
              tentativasPermitidas: 3,
              questoes: [
                { id: 'q1', enunciado: 'O que é o numerador de uma fração?', alternativas: ['Número de cima', 'Número de baixo', 'Ambos', 'Nenhum'], gabarito: 0, bncc: 'EF06MA01' },
                { id: 'q2', enunciado: 'Na fração 3/4, qual é o denominador?', alternativas: ['3', '4', '7', '12'], gabarito: 1, bncc: 'EF06MA01' },
                { id: 'q3', enunciado: 'Como se lê a fração 2/5?', alternativas: ['Dois quintos', 'Cinco meios', 'Doze avos', 'Três quartos'], gabarito: 0, bncc: 'EF06MA01' },
              ],
            },
          },
        ],
      },
      {
        id: 'mod-1-2',
        nome: 'Unidade 2: Operações com Frações',
        descricao: 'Adição, subtração, multiplicação e divisão de frações',
        ordem: 2,
        aulas: [
          {
            id: 'aula-1-2-1',
            titulo: 'Adição de Frações',
            descricao: 'Como somar frações com mesmo e diferente denominador',
            tipo: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBliss.mp4',
            duracao: 540,
            ordem: 1,
            liberacao: '2026-01-20',
            visibilidade: 'disponivel',
            transcricao: 'Para somar frações com mesmo denominador, somamos os numeradores e mantemos o denominador.',
            resumoIA: ['Frações com mesmo denominador', 'Frações com denominadores diferentes', 'MMC'],
          },
          {
            id: 'aula-1-2-2',
            titulo: 'Tarefa: Praticando Adição',
            descricao: 'Resolva 10 exercícios de adição de frações',
            tipo: 'tarefa',
            duracao: 1800,
            ordem: 2,
            liberacao: '2026-01-22',
            visibilidade: 'disponivel',
            tarefa: {
              descricao: 'Resolva os exercícios da página 45 do livro didático',
              prazo: '2026-01-30',
              valorMaximo: 10,
              rubrica: '50% cálculos corretos + 30% organização + 20% justificativas',
            },
          },
        ],
      },
    ],
    criadoEm: '2026-01-10T10:00:00Z',
    atualizadoEm: '2026-01-15T14:30:00Z',
  },
  {
    id: 'trilha-2',
    nome: 'Ciências 7º Ano - Fotossíntese',
    descricao: 'Entenda o processo de fotossíntese e sua importância para a vida',
    turmaId: 't2',
    disciplina: 'Ciências',
    cor: '#10B981',
    thumbnail: '',
    nivel: 'Intermediário',
    certificado: true,
    modulos: [
      {
        id: 'mod-2-1',
        nome: 'Introdução à Fotossíntese',
        descricao: 'Conceitos básicos e importância do processo',
        ordem: 1,
        aulas: [
          {
            id: 'aula-2-1-1',
            titulo: 'O que é Fotossíntese?',
            descricao: 'Introdução ao processo de fotossíntese',
            tipo: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duracao: 480,
            ordem: 1,
            liberacao: '2026-02-01',
            visibilidade: 'disponivel',
            transcricao: 'A fotossíntese é o processo pelo qual as plantas produzem seu próprio alimento usando luz solar, água e gás carbônico.',
            resumoIA: ['Definição de fotossíntese', 'Ingredientes necessários', 'Produtos gerados'],
          },
          {
            id: 'aula-2-1-2',
            titulo: 'Material de Apoio: Fotossíntese',
            descricao: 'PDF com esquemas e exercícios',
            tipo: 'pdf',
            conteudo: 'Esquema completo da fotossíntese com exercícios práticos',
            duracao: 1200,
            ordem: 2,
            liberacao: '2026-02-01',
            visibilidade: 'disponivel',
          },
        ],
      },
    ],
    criadoEm: '2026-01-20T09:00:00Z',
    atualizadoEm: '2026-02-01T10:00:00Z',
  },
  {
    id: 'trilha-3',
    nome: 'Português - Redação ENEM',
    descricao: 'Preparação completa para a redação do ENEM com técnicas avançadas',
    turmaId: 't1',
    disciplina: 'Português',
    cor: '#8B5CF6',
    thumbnail: '',
    nivel: 'Avançado',
    certificado: true,
    modulos: [
      {
        id: 'mod-3-1',
        nome: 'Estrutura da Redação',
        descricao: 'Aprenda a estruturar sua redação nota 1000',
        ordem: 1,
        aulas: [
          {
            id: 'aula-3-1-1',
            titulo: 'Introdução Perfeita',
            descricao: 'Técnicas para criar introduções impactantes',
            tipo: 'video',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            duracao: 900,
            ordem: 1,
            liberacao: '2026-03-01',
            visibilidade: 'disponivel',
            transcricao: 'A introdução é a porta de entrada da sua redação. Deve conter tese, contextualização e apresentação do tema.',
            resumoIA: ['Função da introdução', 'Elementos essenciais', 'Exemplos práticos'],
          },
          {
            id: 'aula-3-1-2',
            titulo: 'Link: Banco de Redações Nota 1000',
            descricao: 'Acesse redações modelo para estudo',
            tipo: 'link',
            linkExterno: 'https://www.example.com/redacoes',
            duracao: 60,
            ordem: 2,
            liberacao: '2026-03-01',
            visibilidade: 'disponivel',
          },
        ],
      },
    ],
    criadoEm: '2026-02-15T11:00:00Z',
    atualizadoEm: '2026-03-01T09:00:00Z',
  },
];

const progressoSeed: ProgressoAluno[] = [
  {
    id: 'prog-1',
    alunoId: 'a1',
    trilhaId: 'trilha-1',
    aulasConcluidas: ['aula-1-1-1'],
    ultimaAula: 'aula-1-1-1',
    progresso: 33,
    tempoTotalEstudo: 720,
    anotacoes: [],
    comentarios: [],
    conquistas: ['c1'],
    dataInicio: '2026-01-15T10:00:00Z',
  },
];

const midiasSeed: Midia[] = [
  {
    id: 'midia-1',
    titulo: 'Introdução às Frações',
    tipo: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duracao: 720,
    criadoEm: '2026-01-10T10:00:00Z',
    tags: ['matemática', 'frações', '6º ano'],
  },
];

// ============ STORE ============
interface AVAState {
  // Dados
  trilhas: Trilha[];
  progressos: ProgressoAluno[];
  conquistas: Conquista[];
  midias: Midia[];
  entregasTarefas: EntregaTarefa[];

  // Actions - Trilhas
  addTrilha: (trilha: Omit<Trilha, 'id' | 'criadoEm' | 'atualizadoEm'>) => string;
  updateTrilha: (id: string, data: Partial<Trilha>) => void;
  deleteTrilha: (id: string) => void;
  getTrilhaById: (id: string) => Trilha | undefined;

  // Actions - Módulos
  addModulo: (trilhaId: string, modulo: Omit<Modulo, 'id'>) => void;
  updateModulo: (trilhaId: string, moduloId: string, data: Partial<Modulo>) => void;
  deleteModulo: (trilhaId: string, moduloId: string) => void;
  moveModulo: (trilhaId: string, moduloId: string, direction: 'up' | 'down') => void;

  // Actions - Aulas
  addAula: (trilhaId: string, moduloId: string, aula: Omit<Aula, 'id'>) => void;
  updateAula: (trilhaId: string, moduloId: string, aulaId: string, data: Partial<Aula>) => void;
  deleteAula: (trilhaId: string, moduloId: string, aulaId: string) => void;
  moveAula: (trilhaId: string, moduloId: string, aulaId: string, direction: 'up' | 'down') => void;

  // Actions - Progresso
  getProgressoAluno: (alunoId: string, trilhaId: string) => ProgressoAluno | undefined;
  marcarAulaConcluida: (alunoId: string, trilhaId: string, aulaId: string) => void;
  atualizarUltimaAula: (alunoId: string, trilhaId: string, aulaId: string) => void;
  adicionarTempoEstudo: (alunoId: string, trilhaId: string, segundos: number) => void;
  desbloquearTrilhaParaAluno: (alunoId: string, trilhaId: string) => void;

  // Actions - Anotações
  addAnotacao: (alunoId: string, aulaId: string, texto: string, timestamp: number) => void;
  deleteAnotacao: (alunoId: string, anotacaoId: string) => void;

  // Actions - Comentários
  addComentario: (alunoId: string, alunoNome: string, aulaId: string, texto: string) => void;

  // Actions - Conquistas
  addConquista: (alunoId: string, trilhaId: string, conquistaId: string) => void;

  // Actions - Tarefas
  entregarTarefa: (entrega: Omit<EntregaTarefa, 'id' | 'status'>) => void;
  corrigirTarefa: (entregaId: string, nota: number, feedback: string) => void;

  // Actions - Mídias
  addMidia: (midia: Omit<Midia, 'id' | 'criadoEm'>) => void;
  deleteMidia: (id: string) => void;
}

export const useAVAStore = create<AVAState>()(
  persist(
    (set, get) => ({
      trilhas: trilhasSeed,
      progressos: progressoSeed,
      conquistas: conquistasSeed,
      midias: midiasSeed,
      entregasTarefas: [],

      // Trilhas
      addTrilha: (trilha) => {
        const id = `trilha-${uuidv4()}`;
        const now = new Date().toISOString();
        set((state) => ({
          trilhas: [...state.trilhas, { ...trilha, id, criadoEm: now, atualizadoEm: now }],
        }));
        return id;
      },
      updateTrilha: (id, data) => {
        set((state) => ({
          trilhas: state.trilhas.map((t) =>
            t.id === id ? { ...t, ...data, atualizadoEm: new Date().toISOString() } : t
          ),
        }));
      },
      deleteTrilha: (id) => {
        set((state) => ({
          trilhas: state.trilhas.filter((t) => t.id !== id),
          progressos: state.progressos.filter((p) => p.trilhaId !== id),
        }));
      },
      getTrilhaById: (id) => get().trilhas.find((t) => t.id === id),

      // Módulos
      addModulo: (trilhaId, modulo) => {
        const id = `mod-${uuidv4()}`;
        set((state) => ({
          trilhas: state.trilhas.map((t) =>
            t.id === trilhaId
              ? { ...t, modulos: [...t.modulos, { ...modulo, id }], atualizadoEm: new Date().toISOString() }
              : t
          ),
        }));
      },
      updateModulo: (trilhaId, moduloId, data) => {
        set((state) => ({
          trilhas: state.trilhas.map((t) =>
            t.id === trilhaId
              ? {
                  ...t,
                  modulos: t.modulos.map((m) => (m.id === moduloId ? { ...m, ...data } : m)),
                  atualizadoEm: new Date().toISOString(),
                }
              : t
          ),
        }));
      },
      deleteModulo: (trilhaId, moduloId) => {
        set((state) => ({
          trilhas: state.trilhas.map((t) =>
            t.id === trilhaId
              ? { ...t, modulos: t.modulos.filter((m) => m.id !== moduloId) }
              : t
          ),
        }));
      },
      moveModulo: (trilhaId, moduloId, direction) => {
        set((state) => ({
          trilhas: state.trilhas.map((t) => {
            if (t.id !== trilhaId) return t;
            const modulos = [...t.modulos].sort((a, b) => a.ordem - b.ordem);
            const idx = modulos.findIndex((m) => m.id === moduloId);
            if (idx === -1) return t;
            const newIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (newIdx < 0 || newIdx >= modulos.length) return t;
            [modulos[idx], modulos[newIdx]] = [modulos[newIdx], modulos[idx]];
            modulos.forEach((m, i) => (m.ordem = i + 1));
            return { ...t, modulos };
          }),
        }));
      },

      // Aulas
      addAula: (trilhaId, moduloId, aula) => {
        const id = `aula-${uuidv4()}`;
        set((state) => ({
          trilhas: state.trilhas.map((t) => {
            if (t.id !== trilhaId) return t;
            return {
              ...t,
              modulos: t.modulos.map((m) =>
                m.id === moduloId
                  ? { ...m, aulas: [...m.aulas, { ...aula, id }] }
                  : m
              ),
              atualizadoEm: new Date().toISOString(),
            };
          }),
        }));
      },
      updateAula: (trilhaId, moduloId, aulaId, data) => {
        set((state) => ({
          trilhas: state.trilhas.map((t) => {
            if (t.id !== trilhaId) return t;
            return {
              ...t,
              modulos: t.modulos.map((m) =>
                m.id === moduloId
                  ? {
                      ...m,
                      aulas: m.aulas.map((a) => (a.id === aulaId ? { ...a, ...data } : a)),
                    }
                  : m
              ),
            };
          }),
        }));
      },
      deleteAula: (trilhaId, moduloId, aulaId) => {
        set((state) => ({
          trilhas: state.trilhas.map((t) => {
            if (t.id !== trilhaId) return t;
            return {
              ...t,
              modulos: t.modulos.map((m) =>
                m.id === moduloId
                  ? { ...m, aulas: m.aulas.filter((a) => a.id !== aulaId) }
                  : m
              ),
            };
          }),
        }));
      },
      moveAula: (trilhaId, moduloId, aulaId, direction) => {
        set((state) => ({
          trilhas: state.trilhas.map((t) => {
            if (t.id !== trilhaId) return t;
            return {
              ...t,
              modulos: t.modulos.map((m) => {
                if (m.id !== moduloId) return m;
                const aulas = [...m.aulas].sort((a, b) => a.ordem - b.ordem);
                const idx = aulas.findIndex((a) => a.id === aulaId);
                if (idx === -1) return m;
                const newIdx = direction === 'up' ? idx - 1 : idx + 1;
                if (newIdx < 0 || newIdx >= aulas.length) return m;
                [aulas[idx], aulas[newIdx]] = [aulas[newIdx], aulas[idx]];
                aulas.forEach((a, i) => (a.ordem = i + 1));
                return { ...m, aulas };
              }),
            };
          }),
        }));
      },

      // Progresso
      getProgressoAluno: (alunoId, trilhaId) => {
        return get().progressos.find((p) => p.alunoId === alunoId && p.trilhaId === trilhaId);
      },
      marcarAulaConcluida: (alunoId, trilhaId, aulaId) => {
        set((state) => {
          const trilha = state.trilhas.find((t) => t.id === trilhaId);
          if (!trilha) return state;

          const totalAulas = trilha.modulos.reduce((acc, m) => acc + m.aulas.length, 0);
          const existing = state.progressos.find((p) => p.alunoId === alunoId && p.trilhaId === trilhaId);

          if (existing) {
            const novasConcluidas = existing.aulasConcluidas.includes(aulaId)
              ? existing.aulasConcluidas
              : [...existing.aulasConcluidas, aulaId];
            const novoProgresso = Math.round((novasConcluidas.length / totalAulas) * 100);

            // Verificar conquistas
            const novasConquistas = [...existing.conquistas];
            if (novasConcluidas.length === 1 && !novasConquistas.includes('c1')) {
              novasConquistas.push('c1');
            }

            // Verificar se módulo foi concluído
            trilha.modulos.forEach((modulo) => {
              const todasConcluidas = modulo.aulas.every((a) => novasConcluidas.includes(a.id));
              if (todasConcluidas && !novasConquistas.includes('c2')) {
                novasConquistas.push('c2');
              }
            });

            // Verificar se trilha foi concluída
            const trilhaConcluida = novoProgresso === 100;
            if (trilhaConcluida && !novasConquistas.includes('c3')) {
              novasConquistas.push('c3');
            }

            return {
              progressos: state.progressos.map((p) =>
                p.alunoId === alunoId && p.trilhaId === trilhaId
                  ? {
                      ...p,
                      aulasConcluidas: novasConcluidas,
                      ultimaAula: aulaId,
                      progresso: novoProgresso,
                      conquistas: novasConquistas,
                      dataConclusao: trilhaConcluida ? new Date().toISOString() : p.dataConclusao,
                    }
                  : p
              ),
            };
          } else {
            const novoProgresso = Math.round((1 / totalAulas) * 100);
            return {
              progressos: [
                ...state.progressos,
                {
                  id: `prog-${uuidv4()}`,
                  alunoId,
                  trilhaId,
                  aulasConcluidas: [aulaId],
                  ultimaAula: aulaId,
                  progresso: novoProgresso,
                  tempoTotalEstudo: 0,
                  anotacoes: [],
                  comentarios: [],
                  conquistas: ['c1'],
                  dataInicio: new Date().toISOString(),
                },
              ],
            };
          }
        });
      },
      atualizarUltimaAula: (alunoId, trilhaId, aulaId) => {
        set((state) => ({
          progressos: state.progressos.map((p) =>
            p.alunoId === alunoId && p.trilhaId === trilhaId
              ? { ...p, ultimaAula: aulaId }
              : p
          ),
        }));
      },
      adicionarTempoEstudo: (alunoId, trilhaId, segundos) => {
        set((state) => ({
          progressos: state.progressos.map((p) =>
            p.alunoId === alunoId && p.trilhaId === trilhaId
              ? { ...p, tempoTotalEstudo: p.tempoTotalEstudo + segundos }
              : p
          ),
        }));
      },
      desbloquearTrilhaParaAluno: (alunoId, trilhaId) => {
        const existing = get().progressos.find((p) => p.alunoId === alunoId && p.trilhaId === trilhaId);
        if (!existing) {
          set((state) => ({
            progressos: [
              ...state.progressos,
              {
                id: `prog-${uuidv4()}`,
                alunoId,
                trilhaId,
                aulasConcluidas: [],
                ultimaAula: null,
                progresso: 0,
                tempoTotalEstudo: 0,
                anotacoes: [],
                comentarios: [],
                conquistas: [],
                dataInicio: new Date().toISOString(),
              },
            ],
          }));
        }
      },

      // Anotações
      addAnotacao: (alunoId, aulaId, texto, timestamp) => {
        const anotacao: Anotacao = {
          id: `anot-${uuidv4()}`,
          aulaId,
          alunoId,
          texto,
          timestamp,
          criadoEm: new Date().toISOString(),
        };
        set((state) => ({
          progressos: state.progressos.map((p) =>
            p.alunoId === alunoId ? { ...p, anotacoes: [...p.anotacoes, anotacao] } : p
          ),
        }));
      },
      deleteAnotacao: (alunoId, anotacaoId) => {
        set((state) => ({
          progressos: state.progressos.map((p) =>
            p.alunoId === alunoId
              ? { ...p, anotacoes: p.anotacoes.filter((a) => a.id !== anotacaoId) }
              : p
          ),
        }));
      },

      // Comentários
      addComentario: (alunoId, alunoNome, aulaId, texto) => {
        const comentario: Comentario = {
          id: `com-${uuidv4()}`,
          aulaId,
          alunoId,
          alunoNome,
          texto,
          criadoEm: new Date().toISOString(),
          respostas: [],
        };
        set((state) => ({
          progressos: state.progressos.map((p) =>
            p.alunoId === alunoId ? { ...p, comentarios: [...p.comentarios, comentario] } : p
          ),
        }));
      },

      // Conquistas
      addConquista: (alunoId, trilhaId, conquistaId) => {
        set((state) => ({
          progressos: state.progressos.map((p) =>
            p.alunoId === alunoId && p.trilhaId === trilhaId
              ? { ...p, conquistas: [...new Set([...p.conquistas, conquistaId])] }
              : p
          ),
        }));
      },

      // Tarefas
      entregarTarefa: (entrega) => {
        set((state) => ({
          entregasTarefas: [
            ...state.entregasTarefas,
            { ...entrega, id: `entrega-${uuidv4()}`, status: 'pendente' },
          ],
        }));
      },
      corrigirTarefa: (entregaId, nota, feedback) => {
        set((state) => ({
          entregasTarefas: state.entregasTarefas.map((e) =>
            e.id === entregaId ? { ...e, nota, feedback, status: 'corrigido' } : e
          ),
        }));
      },

      // Mídias
      addMidia: (midia) => {
        set((state) => ({
          midias: [...state.midias, { ...midia, id: `midia-${uuidv4()}`, criadoEm: new Date().toISOString() }],
        }));
      },
      deleteMidia: (id) => {
        set((state) => ({
          midias: state.midias.filter((m) => m.id !== id),
        }));
      },
    }),
    {
      name: 'saber-integral-ava-storage',
    }
  )
);
