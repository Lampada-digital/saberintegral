# 🛠️ COMANDOS ÚTEIS - SABER INTEGRAL

## 📦 INSTALAÇÃO E SETUP

```bash
# Instalar dependências
npm install

# Instalar Vercel CLI globalmente
npm install -g vercel

# Instalar Netlify CLI globalmente
npm install -g netlify-cli
```

---

## 💻 DESENVOLVIMENTO

```bash
# Rodar servidor de desenvolvimento
npm run dev

# Abrir em navegador específico
npm run dev -- --host 0.0.0.0 --port 3000
```

---

## 🏗️ BUILD E TESTES

```bash
# Build de produção
npm run build

# Preview do build local
npm run preview

# Verificar tipos TypeScript
npm run typecheck

# Limpar cache e node_modules
rm -rf node_modules dist package-lock.json
npm install
```

---

## 📤 GIT E GITHUB

### Comandos Básicos
```bash
# Ver status
git status

# Adicionar todos os arquivos
git add .

# Commit com mensagem
git commit -m "feat: nova funcionalidade"

# Push para branch atual
git push

# Push para branch específica
git push origin main
```

### Branches
```bash
# Criar nova branch
git checkout -b feature/nova-feature

# Voltar para main
git checkout main

# Listar branches
git branch

# Deletar branch local
git branch -d feature/nova-feature
```

### Sync com Remote
```bash
# Atualizar repositório local
git pull origin main

# Ver remotes configurados
git remote -v

# Adicionar remote
git remote add origin https://github.com/usuario/repo.git

# Alterar URL do remote
git remote set-url origin https://github.com/usuario/repo.git
```

### Undo e Correções
```bash
# Desfazer mudanças não commitadas
git checkout .

# Remover arquivo do staging
git reset HEAD arquivo.txt

# Alterar última mensagem de commit
git commit --amend -m "nova mensagem"

# Voltar último commit (mantendo mudanças)
git reset --soft HEAD~1

# Voltar último commit (descartando mudanças)
git reset --hard HEAD~1
```

---

## 🔺 VERCEL CLI

```bash
# Login
vercel login

# Deploy de desenvolvimento (preview)
vercel

# Deploy de produção
vercel --prod

# Listar deployments
vercel ls

# Ver logs de um deployment
vercel logs <deployment-url>

# Remover deployment
vercel rm <deployment-url>

# Adicionar variável de ambiente
vercel env add VITE_SUPABASE_URL

# Listar variáveis de ambiente
vercel env ls

# Pull configurações do projeto
vercel pull
```

---

## 💎 NETLIFY CLI

```bash
# Login
netlify login

# Inicializar projeto
netlify init

# Deploy manual
netlify deploy

# Deploy de produção
netlify deploy --prod

# Deploy com build
netlify deploy --prod --build

# Abrir site no navegador
netlify open

# Listar sites
netlify sites:list

# Ver status do site
netlify status

# Adicionar variável de ambiente
netlify env:set VITE_SUPABASE_URL valor

# Listar variáveis de ambiente
netlify env:list

# Ver logs em tempo real
netlify logs
```

---

## 🐛 DEBUG E TROUBLESHOOTING

### Limpar Cache
```bash
# Limpar cache do npm
npm cache clean --force

# Limpar cache do Vite
rm -rf node_modules/.vite

# Limpar build anterior
rm -rf dist
```

### Verificar Dependências
```bash
# Listar dependências desatualizadas
npm outdated

# Atualizar todas as dependências
npm update

# Ver árvore de dependências
npm list

# Ver dependências globais
npm list -g --depth=0
```

### Logs e Erros
```bash
# Ver logs do Vite com mais detalhes
npm run dev -- --debug

# Ver erros TypeScript detalhados
npx tsc --noEmit

# Ver bundle analysis
npm run build -- --mode production
```

---

## 🌍 DOMÍNIOS E DNS

### Testar DNS
```bash
# Verificar DNS (Linux/Mac)
dig seu-dominio.com.br

# Verificar DNS (Windows)
nslookup seu-dominio.com.br

# Verificar propagação DNS
# Acesse: https://www.whatsmydns.net/
```

### Certificados SSL
```bash
# Vercel: Automático (Let's Encrypt)
# Netlify: Automático (Let's Encrypt)

# Verificar certificado
# Acesse: https://www.ssllabs.com/ssltest/
```

---

## 📊 PERFORMANCE

### Lighthouse
```bash
# Rodar Lighthouse via CLI
npx lighthouse https://seu-site.com --view

# Gerar relatório HTML
npx lighthouse https://seu-site.com --output html --output-path ./report.html
```

### Bundle Analysis
```bash
# Analisar bundle
npm run build
npx vite-bundle-visualizer

# Ou use:
# https://bundlephobia.com/
```

---

## 🔐 SEGURANÇA

### Verificar Vulnerabilidades
```bash
# Auditar dependências
npm audit

# Corrigir vulnerabilidades automaticamente
npm audit fix

# Corrigir forçadamente (pode quebrar coisas)
npm audit fix --force
```

### Variáveis de Ambiente
```bash
# Criar arquivo .env.local (NÃO subir para git)
echo "VITE_SUPABASE_URL=sua_url" > .env.local
echo "VITE_SUPABASE_ANON_KEY=sua_key" >> .env.local

# Verificar se .gitignore está ignorando .env*
cat .gitignore | grep .env
```

---

## 📦 PACOTES ÚTEIS

### Instalar Pacotes Comuns
```bash
# Analytics
npm install @vercel/analytics

# Icons
npm install lucide-react

# Forms
npm install react-hook-form @hookform/resolvers zod

# State Management
npm install zustand

# HTTP Client
npm install axios

# Date Handling
npm install date-fns

# CSV Parsing
npm install papaparse @types/papaparse
```

---

## 🎯 WORKFLOW RECOMENDADO

### Desenvolvimento Diário
```bash
# 1. Atualizar código
git pull origin main

# 2. Instalar novas dependências (se houver)
npm install

# 3. Rodar em desenvolvimento
npm run dev

# 4. Fazer mudanças...

# 5. Testar build
npm run build

# 6. Commit e push
git add .
git commit -m "feat: descrição da mudança"
git push origin main

# 7. Deploy automático (Vercel/Netlify)
# Aguardar ~1 minuto
```

### Release
```bash
# 1. Atualizar versão no package.json
npm version patch  # 1.0.0 -> 1.0.1
# ou
npm version minor  # 1.0.0 -> 1.1.0
# ou
npm version major  # 1.0.0 -> 2.0.0

# 2. Push com tags
git push origin main --tags

# 3. Deploy automático
```

---

## 📞 SUPORTE

### Documentação Oficial
- **Vite:** https://vitejs.dev
- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org
- **Tailwind:** https://tailwindcss.com
- **Vercel:** https://vercel.com/docs
- **Netlify:** https://docs.netlify.com

### Comunidades
- **Stack Overflow:** https://stackoverflow.com
- **GitHub Discussions:** https://github.com/vitejs/vite/discussions
- **Discord Vite:** https://chat.vitejs.dev

---

**Bom desenvolvimento! 🚀**
