# ✅ CHECKLIST DE DEPLOY - SABER INTEGRAL

## 📋 PRÉ-DEPLOY

- [ ] Projeto buildando sem erros (`npm run build`)
- [ ] Todos os testes passando (se houver)
- [ ] Variáveis de ambiente configuradas (se necessário)
- [ ] README.md atualizado
- [ ] `.gitignore` configurado

---

## 📤 GITHUB

### Configuração Inicial
- [ ] `git init` executado
- [ ] `git add .` executado
- [ ] `git commit -m "feat: projeto completo"` executado
- [ ] Branch renomeada para `main` (`git branch -M main`)

### Repositório Remoto
- [ ] Repositório criado no GitHub
- [ ] Remote configurado (`git remote add origin ...`)
- [ ] Push realizado (`git push -u origin main`)
- [ ] Código visível no GitHub

---

## 🔺 VERCEL

### Deploy
- [ ] Conta criada/verificada na Vercel
- [ ] Repositório importado
- [ ] Framework preset: **Vite**
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Deploy concluído com sucesso
- [ ] Site acessível na URL `.vercel.app`

### Configurações Pós-Deploy
- [ ] `vercel.json` presente no repositório
- [ ] Rotas funcionando (testar `/login`, `/register`)
- [ ] Assets carregando corretamente
- [ ] [Opcional] Domínio customizado configurado
- [ ] [Opcional] Variáveis de ambiente adicionadas

---

## 💎 NETLIFY

### Deploy
- [ ] Conta criada/verificada na Netlify
- [ ] Repositório importado
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Deploy concluído com sucesso
- [ ] Site acessível na URL `.netlify.app`

### Configurações Pós-Deploy
- [ ] `netlify.toml` presente no repositório
- [ ] `public/_redirects` presente no repositório
- [ ] Rotas funcionando (testar `/login`, `/register`)
- [ ] Assets carregando corretamente
- [ ] [Opcional] Domínio customizado configurado
- [ ] [Opcional] Variáveis de ambiente adicionadas

---

## 🧪 TESTES PÓS-DEPLOY

### Funcionalidades Críticas
- [ ] Landing page carregando
- [ ] Navegação entre páginas funcionando
- [ ] Formulários de login/registro funcionando
- [ ] Checkout processando
- [ ] Dashboard acessível após login
- [ ] Módulos (Gabarito, AVA, Financeiro) funcionando
- [ ] Responsividade mobile OK

### Performance
- [ ] Página carregando em < 3 segundos
- [ ] Sem erros no console do navegador
- [ ] Imagens/otimizações OK
- [ ] Cache funcionando (assets estáticos)

### SEO & Meta
- [ ] Title da página correto
- [ ] Meta tags presentes
- [ ] Favicon configurado
- [ ] Open Graph tags (se necessário)

---

## 🔄 CI/CD

### Automação
- [ ] Push automático configurado
- [ ] Preview de PRs funcionando (Vercel/Netlify)
- [ ] Deploy automático na branch `main`
- [ ] Notificações configuradas (email/Slack)

---

## 🌍 DOMÍNIO CUSTOMIZADO (Opcional)

### Configuração
- [ ] Domínio comprado (ex: Registro.br, GoDaddy)
- [ ] DNS configurado conforme instruções
- [ ] Domínio adicionado na Vercel/Netlify
- [ ] Certificado SSL ativo (automático)
- [ ] Redirecionamento www → não-www (ou vice-versa)
- [ ] Site acessível pelo domínio customizado

---

## 📊 MONITORAMENTO (Opcional)

### Analytics
- [ ] Google Analytics configurado
- [ ] Vercel Analytics ativado (se usar Vercel)
- [ ] Netlify Analytics ativado (se usar Netlify)

### Logs & Erros
- [ ] Sentry configurado (se necessário)
- [ ] Logs de deploy acessíveis
- [ ] Alertas de erro configurados

---

## 🎉 FINALIZAÇÃO

- [ ] Site em produção funcionando 100%
- [ ] Documentação atualizada
- [ ] Equipe notificada (se aplicável)
- [ ] URL compartilhada com stakeholders

---

## 📞 SUPORTE

### Problemas?
- **Vercel:** https://vercel.com/support
- **Netlify:** https://netlify.com/support
- **GitHub:** https://github.com/support

### Documentação
- **README.md** - Guia completo
- **DEPLOY.md** - Guia rápido
- **vercel.json** - Configuração Vercel
- **netlify.toml** - Configuração Netlify

---

**Status Final:** [ ] DEPLOY CONCLUÍDO COM SUCESSO ✅
