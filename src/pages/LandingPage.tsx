import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BarChart3, BookOpen, CreditCard, Shield, Zap, ChevronDown, ChevronUp, Check, Star, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const painPoints = [
  { icon: BookOpen, title: 'Correção manual demora horas', solution: 'Correção automatizada com IA que devolve notas em segundos' },
  { icon: BarChart3, title: 'Dados dispersos em planilhas', solution: 'Dashboard unificado com analytics em tempo real' },
  { icon: CreditCard, title: 'Cobranças manuais e inadimplência', solution: 'Faturamento automático com controle de inadimplência' },
  { icon: Shield, title: 'Sem personalização da marca', solution: 'White-label completo: logo, cores e subdomínio próprios' },
];

const faqItems = [
  { q: 'Preciso de conhecimento técnico para usar?', a: 'Não! O SABER INTEGRAL foi desenvolvido para ser intuitivo. Em menos de 10 minutos você configura tudo e começa a usar.' },
  { q: 'Posso cancelar a qualquer momento?', a: 'Sim, sem multa ou fidelidade. Cancele quando quiser diretamente no painel.' },
  { q: 'Os dados dos alunos estão seguros?', a: 'Utilizamos criptografia de ponta a ponta e seguimos todas as normas da LGPD. Seus dados estão 100% protegidos.' },
  { q: 'Funciona para qualquer nível de ensino?', a: 'Sim! Do fundamental ao médio, EJA e cursos livres. A plataforma se adapta ao seu modelo.' },
  { q: 'Existe limite de alunos?', a: 'No plano atual, até 500 alunos. Para volumes maiores, entre em contato para um plano customizado.' },
];

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-primary">SABER <span className="text-gold">INTEGRAL</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#solucoes" className="text-sm text-gray-600 hover:text-primary transition-colors">Soluções</a>
            <a href="#preco" className="text-sm text-gray-600 hover:text-primary transition-colors">Preço</a>
            <a href="#faq" className="text-sm text-gray-600 hover:text-primary transition-colors">FAQ</a>
            <Link to="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button variant="gold" size="sm">Assinar Agora</Button>
            </Link>
          </nav>
          <Link to="/register" className="md:hidden">
            <Button variant="gold" size="sm">Assinar</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-primary">Plataforma #1 para escolas integrais</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary leading-tight mb-6">
            Gerencie sua escola<br />
            <span className="text-gold">de forma inteligente</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Correção de provas, AVA, financeiro e muito mais. Tudo em uma única plataforma white-label.
          </p>
          <p className="text-2xl font-bold text-primary mb-8">
            R$ 299/mês <span className="text-base font-normal text-gray-500">• sem taxa de setup</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="gold" size="lg" className="w-full sm:w-auto">
                Assinar Agora <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#solucoes">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Ver Soluções
              </Button>
            </a>
          </div>
          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> 7 dias grátis</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> Sem fidelidade</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> Suporte dedicado</span>
          </div>
        </div>
      </section>

      {/* Dores/Soluções */}
      <section id="solucoes" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Resolvemos suas maiores dores</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Cada funcionalidade foi pensada para eliminar ineficiências do dia a dia escolar.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {painPoints.map((item, idx) => (
              <Card key={idx} hover>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/5 rounded-lg">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1 line-through decoration-red-400">{item.title}</p>
                    <p className="text-sm text-green-700 font-medium">✓ {item.solution}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="preco" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Plano Único, Sem Surpresas</h2>
            <p className="text-gray-600">Tudo incluso. Sem taxas escondidas.</p>
          </div>
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-gold relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gold text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
              <div className="text-center pt-4">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-gold fill-gold" />)}
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">SABER INTEGRAL</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-primary">R$ 299</span>
                  <span className="text-gray-500">/mês</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  {[
                    'Correção automatizada de provas',
                    'Ambiente Virtual de Aprendizagem',
                    'Módulo Financeiro completo',
                    'White-label (logo, cores, subdomínio)',
                    'Até 500 alunos',
                    'Suporte prioritário',
                    'Relatórios e dashboards',
                    'App mobile para alunos',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/checkout" className="block">
                  <Button variant="gold" size="lg" className="w-full">
                    Assinar Agora
                  </Button>
                </Link>
                <p className="text-xs text-gray-400 mt-3">Cancele quando quiser • Sem multa</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {faqItems.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800 pr-4">{item.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-gold" />
            <span className="text-lg font-bold">SABER <span className="text-gold">INTEGRAL</span></span>
          </div>
          <p className="text-sm text-white/60">© 2026 Saber Integral. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
