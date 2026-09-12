# 🚀 GUIA RÁPIDO DE DEPLOY

## 📤 1. SUBIR NO GITHUB

```bash
# Inicializar git
git init
git add .
git commit -m "feat: projeto completo SABER INTEGRAL"
git branch -M main

# Conectar ao GitHub (SUBSTITUA pelo seu usuário)
git remote add origin https://github.com/SEU_USUARIO/saber-integral.git
git push -u origin main
```

---

## 🔺 2. DEPLOY NA VERCEL

### Método Rápido (Web):

1. Acesse: **https://vercel.com/new**
2. Importe o repositório `saber-integral`
3. Clique em **"Deploy"**
4. ✅ Pronto! Site no ar em ~1 minuto

### Via Terminal:

```bash
npm install -g vercel
vercel login
vercel --prod
```

**URL final:** `https://saber-integral.vercel.app`

---

## 💎 3. DEPLOY NA NETLIFY

### Método Rápido (Web):

1. Acesse: **https://app.netlify.com/start**
2. Conecte com GitHub
3. Selecione `saber-integral`
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Clique em **"Deploy site"**
6. ✅ Pronto! Site no ar em ~1 minuto

### Via Terminal:

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

**URL final:** `https://saber-integral.netlify.app`

---

## ⚡ DEPLOY ALTERNATIVO (Netlify Drop - Sem GitHub)

1. Rode: `npm run build`
2. Acesse: **https://app.netlify.com/drop**
3. Arraste a pasta `dist` para a página
4. ✅ Site no ar em 10 segundos!

---

## 🎯 RESUMO

| Passo | Ação | Tempo |
|-------|------|-------|
| 1 | Subir no GitHub | 2 min |
| 2 | Deploy Vercel | 1 min |
| 3 | Deploy Netlify (opcional) | 1 min |

**Total: ~4 minutos para ter o site no ar!**

---

## 🔗 LINKS ÚTEIS

- **Vercel:** https://vercel.com
- **Netlify:** https://netlify.com
- **GitHub:** https://github.com

---

## ✅ CONFIGURAÇÕES JÁ INCLUÍDAS

- ✅ `vercel.json` - Configuração Vercel (rewrites para SPA)
- ✅ `netlify.toml` - Configuração Netlify (redirects)
- ✅ `public/_redirects` - Fallback Netlify
- ✅ `.gitignore` - Ignora node_modules, dist, etc.

---

## 🐛 PROBLEMAS COMUNS

### "Page not found" nas rotas?
→ Verifique se `vercel.json` e `netlify.toml` estão no repositório

### Build falha?
→ Rode `npm run typecheck` localmente para ver erros

### Assets não carregam?
→ Limpe o cache: `rm -rf dist && npm run build`

---

**Pronto para deploy! 🚀**
