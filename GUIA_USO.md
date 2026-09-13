# 🚀 GUIA DE USO - SABER INTEGRAL

## 📋 Sumário
1. [Primeiros Passos](#primeiros-passos)
2. [Dashboard](#dashboard)
3. [Gestão de Alunos](#gestão-de-alunos)
4. [Módulo Financeiro](#módulo-financeiro)
5. [Portal do Aluno](#portal-do-aluno)
6. [IA Avançada](#ia-avançada)

---

## 🎯 Primeiros Passos

### 1. Instalação e Inicialização
```bash
npm install
npm run dev
```

### 2. Acesso ao Sistema
- Acesse: `http://localhost:5173`
- Faça login ou crie uma nova conta
- Complete o onboarding (logo, cores, nome da escola)

### 3. Explorando o Sistema
Após o login, você será direcionado ao **Dashboard** principal.

---

## 📊 Dashboard

O dashboard expandido apresenta **8 métricas principais** e análises avançadas:

### Cards de Métricas
1. **Alunos Ativos** - Total de alunos ativos com % de crescimento
2. **Professores** - Total de professores cadastrados
3. **Turmas Ativas** - Total de turmas no ano letivo
4. **Receita do Mês** - Receita prevista para o mês atual
5. **Pendente** - Valor total de mensalidades pendentes
6. **Inadimplência** - Percentual de inadimplência
7. **Média Geral** - Média de desempenho dos alunos
8. **Materiais AVA** - Total de materiais publicados

### Painel Inteligente (IA)
- **Risco de Evasão**: Alunos com alto risco de evasão
- **Risco de Inadimplência**: Alunos com risco financeiro
- **Baixo Desempenho**: Alunos com média < 5
- **Sugestões da IA**: Ações preventivas personalizadas

### Previsão de Fluxo de Caixa
- Projeção de receita, despesas e lucro para os próximos 3-6 meses
- Percentual de confiança da previsão
- Baseado em histórico de adimplência

### Atividades Recentes
- Timeline das últimas ações do sistema
- Novas matrículas, pagamentos, notas lançadas

---

## 👥 Gestão de Alunos

### Interface Completa com 5 Abas

#### Aba 1: Dados Pessoais
- Nome completo, Email, Data de nascimento
- CPF, RG, Sexo, Cor/Raça
- Naturalidade, Nacionalidade
- Telefone, Celular

#### Aba 2: Endereço
- CEP, Logradouro, Número, Complemento
- Bairro, Cidade, Estado

#### Aba 3: Responsável
- Nome, CPF, Telefone, Email
- Parentesco, Profissão

#### Aba 4: Saúde
- Tipo sanguíneo, Alergias
- Medicamentos, Plano de saúde
- Contato de emergência

#### Aba 5: Acadêmico
- Turma, Data de matrícula
- Status (ativo/inativo/transferido)
- Observações

### Funcionalidades
- **Busca**: Por nome, email ou responsável
- **Filtros**: Por turma e status
- **Exportar CSV**: Lista completa de alunos
- **Ações**: Ver perfil, Editar, Excluir
- **Perfil Completo**: Modal com todas as informações

### Como Criar um Aluno
1. Clique em **"Novo Aluno"**
2. Preencha os dados nas 5 abas
3. Campos obrigatórios: Nome e Turma
4. Clique em **"Salvar"**

### Como Exportar Alunos
1. Clique em **"Exportar"**
2. Arquivo CSV será baixado automaticamente
3. Contém: Nome, Email, Turma, Responsável, Telefone, Status

---

## 💰 Módulo Financeiro

### Dashboard Financeiro
**6 Cards de Métricas:**
- Receita Total
- Pendente
- Atrasado
- Inadimplência (%)
- Ticket Médio
- Total de Boletos

### Sub-módulos

#### 1. Dashboard (Visão Geral)
- Cards de métricas financeiras
- **Previsão de Fluxo de Caixa** (6 meses)
- **Sugestão de Reajuste IA**
- Alertas de inadimplência

#### 2. Mensalidades
- Tabela completa com filtros
- Filtros: Status (pago/pendente/atrasado), Turma
- Ações: Marcar como pago, Exportar
- Status com badges coloridos

#### 3. Gerar Mensalidades
- Selecionar mês de referência
- Selecionar turmas (checkbox)
- Preview antes de confirmar
- Geração em lote

#### 4. Relatórios
- Relatório de Inadimplência
- Relatório de Recebimentos
- DRE Simplificado
- Fluxo de Caixa Projetado

### Funcionalidades IA

#### Previsão de Fluxo de Caixa
- Projeção para 3-6 meses
- Receita, Despesas e Lucro previstos
- Percentual de confiança (diminui com o tempo)
- Baseado em histórico de adimplência

#### Sugestão de Reajuste
- Calcula reajuste ideal
- Baseado em inflação (5%) + mercado (2%)
- Mostra: Valor atual, Valor sugerido, % de reajuste
- Justificativa detalhada

#### Alertas de Inadimplência
- Lista de alunos com risco > 40%
- Fatores de risco identificados
- Ação sugerida para cada aluno
- Cores: vermelho (>70%) ou laranja (>40%)

### Como Gerar Mensalidades
1. Vá em **"Gerar Mensalidades"**
2. Selecione o mês de referência
3. Marque as turmas desejadas
4. Veja o preview
5. Clique em **"Gerar Mensalidades"**

### Como Marcar como Pago
1. Vá em **"Mensalidades"**
2. Encontre a mensalidade pendente
3. Clique em **"Pagar"**
4. Confirme no modal

---

## 🎓 Portal do Aluno

Acesso em: `/portal` (botão no header do dashboard)

### Dashboard Pessoal
**4 Cards de Resumo:**
1. **Média Geral** - Média de todas as notas
2. **Materiais Disponíveis** - Total de materiais da turma
3. **Pendências** - Mensalidades não pagas
4. **Turma** - Nome da turma atual

### Seções

#### Próximas Atividades
- Lista de provas, trabalhos e redações
- Data de cada atividade
- Tipo (prova, trabalho, redação)

#### Notas Recentes
- Últimas 5 notas lançadas
- Nome da prova
- Data da correção
- Nota com cor (verde ≥7, amarelo 5-7, vermelho <5)

#### Materiais da Turma
- Grid com 4 materiais mais recentes
- Título e tipo (vídeo, PDF, atividade, quiz)
- Clique para acessar

#### Avisos
- Comunicados da escola
- Título e descrição
- Data do aviso

#### Financeiro
- Últimas 3 mensalidades
- Data de vencimento
- Valor
- Status (pago/pendente/atrasado)
- Botão "Ver todas"

#### Minha Turma
- Nome da turma
- Série
- Turno

### Como Acessar
1. Faça login no sistema
2. Clique em **"Portal do Aluno"** no header
3. Veja todas as informações pessoais

---

## 🤖 IA Avançada

### Funcionalidades de IA

#### 1. Análise Preditiva
**Risco de Evasão:**
- Analisa: Notas, frequência, inadimplência, status
- Calcula % de risco (0-100%)
- Sugere ações preventivas

**Risco de Inadimplência:**
- Analisa: Histórico de pagamentos, desempenho
- Calcula % de risco
- Sugere ações (WhatsApp, email, negociação)

**Desempenho por Turma:**
- Calcula média por turma
- Identifica tendência (melhorando/estável/piorando)

#### 2. Previsão de Fluxo de Caixa
- Projeta receita, despesas e lucro
- Período: 3-6 meses
- Calcula confiança da previsão
- Baseado em taxa de adimplência histórica

#### 3. Sugestão de Reajuste
- Analisa inflação anual (5%)
- Ajuste de mercado (2%)
- Calcula valor sugerido
- Fornece justificativa detalhada

#### 4. Detecção de Despesas Atípicas
- Identifica despesas fora do padrão
- Compara com média por categoria
- Alerta automaticamente

#### 5. Análise de Engajamento AVA
- Taxa de conclusão de cursos
- Tempo médio de estudo
- Materiais mais acessados
- Alunos inativos

#### 6. Correção de Redações
- Análise completa do texto
- Nota 0-1000
- Feedback detalhado
- Pontos fortes e a melhorar
- Erros gramaticais identificados

### Onde Encontrar a IA

**Dashboard:**
- Painel Inteligente (alertas e sugestões)
- Previsão de Fluxo de Caixa

**Financeiro:**
- Sugestão de Reajuste
- Alertas de Inadimplência
- Previsão de Fluxo de Caixa

**Redações:**
- Correção automática com IA
- Feedback detalhado
- Nota por competência

---

## 💡 Dicas de Uso

### 1. Aproveite o Dashboard
- Verifique diariamente o Painel Inteligente
- Monitore os alertas de risco
- Acompanhe a previsão de fluxo de caixa

### 2. Gestão de Alunos
- Mantenha os dados completos (5 abas)
- Use filtros para encontrar alunos rapidamente
- Exporte listas para relatórios externos

### 3. Financeiro
- Gere mensalidades no início do mês
- Monitore inadimplência semanalmente
- Use as sugestões da IA para ações preventivas
- Acompanhe a previsão de fluxo de caixa

### 4. Portal do Aluno
- Compartilhe o link `/portal` com alunos
- Eles podem ver notas, materiais e financeiro
- Reduz chamadas na secretaria

### 5. IA Avançada
- Confie nas sugestões da IA
- Elas são baseadas em dados reais
- Ações preventivas economizam tempo e dinheiro

---

## 🔧 Configurações

### White Label
1. Vá em **Configurações**
2. Upload de logo
3. Escolha cores (primária e secundária)
4. Defina nome da escola e domínio
5. Veja o preview em tempo real
6. Clique em **"Salvar"**

### Exportar/Importar Dados
- **Exportar**: Baixa arquivo JSON com todos os dados
- **Importar**: Carrega arquivo JSON para restaurar dados

### Logout
- Clique em **"Sair"** no menu lateral
- Sessão será encerrada

---

## 📞 Suporte

### Problemas Comuns

**Dados não salvam?**
- Verifique se o localStorage está habilitado
- Limpe o cache do navegador

**IA não mostra sugestões?**
- Cadastre alguns alunos e mensalidades
- A IA precisa de dados para analisar

**Portal do aluno não funciona?**
- Faça login primeiro
- O portal usa dados do primeiro aluno cadastrado

### Documentação
- **README.md**: Visão geral do sistema
- **GUIA_USO.md**: Este guia
- **DEPLOY.md**: Instruções de deploy

---

## 🎉 Aproveite o Sistema!

O SABER INTEGRAL está 100% funcional e pronto para uso. Explore todas as funcionalidades e aproveite o poder da IA para transformar a gestão da sua escola!

**Bom uso! 🚀**
