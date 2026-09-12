# 🎓 SABER INTEGRAL - SaaS Educacional

Plataforma SaaS completa para gestão escolar com correção automatizada de provas, AVA, módulo financeiro e white-label.

## 🚀 Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS v4**
- **React Router DOM** (rotas)
- **Zustand** (estado global)
- **React Hook Form + Zod** (formulários)
- **PapaParse** (CSV)
- **Lucide React** (ícones)

## 📦 Instalação

```bash
npm install
```

## 💻 Desenvolvimento

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

---

# 🌐 DEPLOY GUIAS

## 📤 PASSO 1: Subir no GitHub

### 1.1 Criar repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito → **"New repository"**
3. Preencha:
   - **Repository name:** `saber-integral` (ou o nome que preferir)
   - **Description:** `Plataforma SaaS para gestão escolar`
   - **Public** ou **Private** (sua escolha)
   - ❌ **NÃO** marque "Add a README" (já temos um)
   - ❌ **NÃO** marque "Add .gitignore"
4. Clique em **"Create repository"**

### 1.2 Enviar código para o GitHub

Abra o terminal na pasta do projeto e execute:

```bash
# Inicializar git (se ainda não fez)
git init

# Adicionar todos os arquivos
git add .

# Primeiro commit
git commit -m "feat: projeto completo SABER INTEGRAL"

# Renomear branch para main
git branch -M main

# Conectar ao repositório remoto (SUBSTITUA pelo seu usuário/repo)
git remote add origin https://github.com/SEU_USUARIO/saber-integral.git

# Enviar para o GitHub
git push -u origin main
```

✅ Pronto! Seu código está no GitHub.

---

## 🔺 PASSO 2: Deploy na VERCEL

### Opção A: Via Interface Web (Recomendado)

1. Acesse [vercel.com](https://vercel.com) e faça login (pode usar conta GitHub)
2. Clique em **"Add New..."** → **"Project"**
3. Na lista de repositórios, encontre **`saber-integral`** e clique em **"Import"**
4. Configure o projeto:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build` (já detectado)
   - **Output Directory:** `dist` (já detectado)
   - **Install Command:** `npm install` (já detectado)
5. Clique em **"Deploy"** 🚀
6. Aguarde ~1 minuto. Pronto! Seu site estará no ar em:
   ```
   https://saber-integral.vercel.app
   ```

### Opção B: Via CLI (Vercel CLI)

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Login na Vercel
vercel login

# Dentro da pasta do projeto, fazer deploy
vercel

# Seguir as instruções interativas:
# - Set up and deploy? → Y
# - Which scope? → escolher sua conta
# - Link to existing project? → N
# - Project name? → saber-integral
# - Directory? → ./  (aceitar padrão)
# - Override settings? → N (aceitar padrões)

# Para fazer deploy em produção
vercel --prod
```

### ✅ Configurações importantes na Vercel

O arquivo `vercel.json` já está configurado com:
- ✅ **Rewrites** para SPA (todas as rotas apontam para index.html)
- ✅ **Cache headers** para assets estáticos

### 🌍 Domínio customizado (opcional)

1. No dashboard da Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio (ex: `saberintegral.com.br`)
3. Configure o DNS conforme instruções da Vercel

---

## 💎 PASSO 3: Deploy na NETLIFY

### Opção A: Via Interface Web (Recomendado)

1. Acesse [netlify.com](https://netlify.com) e faça login (pode usar conta GitHub)
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Escolha **"GitHub"** e autorize o Netlify
4. Selecione o repositório **`saber-integral`**
5. Configure o build:
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Clique em **"Deploy site"** 🚀
7. Aguarde ~1 minuto. Seu site estará em:
   ```
   https://nome-aleatorio.netlify.app
   ```

### Opção B: Via Netlify CLI

```bash
# Instalar Netlify CLI globalmente
npm install -g netlify-cli

# Login na Netlify
netlify login

# Dentro da pasta do projeto
netlify init

# Configurar:
# - Choose: "Create & configure a new site"
# - Team: escolher sua team
# - Site name: saber-integral
# - Build command: npm run build
# - Publish directory: dist

# Deploy
netlify deploy --prod
```

### Opção C: Drag & Drop (mais rápido, sem GitHub)

1. Acesse [app.netlify.com/drop](https://app.netlify.com/drop)
2. Rode o build localmente: `npm run build`
3. Arraste a pasta `dist` para a página
4. Pronto! Site no ar em segundos

### ✅ Configurações importantes na Netlify

Os arquivos já configurados:
- ✅ **`netlify.toml`** - Configuração de build e redirects
- ✅ **`public/_redirects`** - Fallback para SPA (todas rotas → index.html)
- ✅ **Cache headers** para assets

### 🌍 Domínio customizado (opcional)

1. No dashboard Netlify, vá em **Domain settings** → **Add custom domain**
2. Digite seu domínio (ex: `saberintegral.com.br`)
3. Configure o DNS conforme instruções

---

## 🔄 CI/CD Automático

Após conectar o repositório GitHub:

- ✅ **Vercel:** A cada `git push` na branch `main`, um novo deploy é feito automaticamente
- ✅ **Netlify:** Idem, deploy automático a cada push

### Preview de Pull Requests

- **Vercel:** Cada PR gera uma URL de preview única
- **Netlify:** Cada PR gera um deploy preview automaticamente

---

## 🐛 Troubleshooting

### Problema: "Page not found" ao acessar rotas como `/login`

**Causa:** O servidor não está redirecionando para o `index.html`

**Solução:** Verifique se os arquivos de configuração estão no repositório:
- `vercel.json` (para Vercel)
- `netlify.toml` E `public/_redirects` (para Netlify)

### Problema: Build falha com erro de TypeScript

**Solução:**
```bash
# Verificar erros localmente
npm run typecheck

# Corrigir os erros e fazer push novamente
```

### Problema: Assets (CSS/JS) não carregam

**Solução:**
```bash
# Limpar cache e rebuild
rm -rf dist node_modules/.vite
npm run build
```

### Problema: Variáveis de ambiente

Se precisar adicionar variáveis (ex: Supabase keys):

**Na Vercel:**
1. Settings → Environment Variables
2. Adicionar `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, etc.

**Na Netlify:**
1. Site settings → Environment variables
2. Adicionar as mesmas variáveis

---

## 📊 Comparativo Vercel vs Netlify

| Recurso | Vercel | Netlify |
|---------|--------|---------|
| Deploy automático | ✅ | ✅ |
| Preview de PRs | ✅ | ✅ |
| Edge Network | ✅ | ✅ |
| Domínio grátis | `.vercel.app` | `.netlify.app` |
| Velocidade | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Plano gratuito | Generoso | Generoso |
| Formulários | ❌ | ✅ (nativo) |
| Functions | ✅ | ✅ |

**Recomendação:** Para este projeto React/Vite, ambos funcionam perfeitamente. A Vercel tem integração ligeiramente melhor com Next.js, mas para Vite/React puro, o Netlify também é excelente.

---

## 🎯 Checklist Final

- [ ] Código subido no GitHub
- [ ] Repositório importado na Vercel
- [ ] Deploy de produção realizado na Vercel
- [ ] Repositório importado no Netlify (opcional)
- [ ] Deploy de produção realizado no Netlify (opcional)
- [ ] Site testado em produção
- [ ] Domínio customizado configurado (opcional)
- [ ] Variáveis de ambiente adicionadas (se necessário)

---

## 📞 Suporte

- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **Vite Docs:** https://vitejs.dev

---

**Feito com ❤️ para transformar a educação**
