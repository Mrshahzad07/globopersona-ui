# DEPLOYMENT GUIDE

## ✅ Production Build Successful

The application has been successfully built and is ready for deployment!

Build output: `dist/` folder (112.61 kB gzipped)

---

## 🚀 Quick Deployment Options

### Option 1: Netlify

#### Method A: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

4. **Done!** Your app will be live at `https://globopersona-ui.netlify.app/login`

#### Method B: Netlify Web UI

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the `dist/` folder
4. Done! Site is live

**Configure SPA routing** in Netlify:
Create `public/_redirects`:

```
/* /index.html 200
```

---

### Option 2: GitHub Pages

1. **Install gh-pages**:

   ```bash
   npm install -D gh-pages
   ```

2. **Add to package.json**:

   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Update vite.config.js** base:

   ```js
   export default defineConfig({
     base: "/globopersona-ui/",
     // ...rest
   });
   ```

4. **Deploy**:

   ```bash
   npm run build
   npm run deploy
   ```

5. **Enable GitHub Pages** in repo settings → GitHub Pages → Source: gh-pages branch

---

### Option 3: AWS S3 + CloudFront

1. **Build the project**:

   ```bash
   npm run build
   ```

2. **Create S3 bucket**:
   - Name: `globopersona-app`
   - Enable static website hosting
   - Public read access

3. **Upload dist/ contents** to S3

4. **Set up CloudFront**:
   - Create distribution
   - Origin: Your S3 bucket
   - Error pages: 404 → /index.html (for SPA routing)

5. **Done!** Access via CloudFront URL

---

### Option 4: Traditional Web Hosting

1. **Build the project**:

   ```bash
   npm run build
   ```

2. **Upload** the contents of `dist/` folder to your web server root

3. **Configure server** for SPA routing:

   **Apache (.htaccess)**:

   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

   **Nginx (nginx.conf)**:

   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

---

## 🔍 Pre-Deployment Checklist

- ✅ Production build completed successfully
- ✅ All pages functional (Login, Dashboard, Campaigns, Contacts, Analytics)
- ✅ 6-step wizard working
- ✅ CSV upload and validation working
- ✅ Charts rendering correctly
- ✅ Responsive design tested
- ✅ Mock API with localStorage persistence
- ✅ Custom favicon included
- ✅ SEO meta tags added

---

## 🔒 Post-Deployment Steps

### 1. Test the Live Site

- [ ] Login functionality
- [ ] Dashboard loads with charts
- [ ] Campaign creation wizard (all 6 steps)
- [ ] CSV upload works
- [ ] Mobile responsiveness
- [ ] All navigation links work

### 2. Optional: Add Custom Domain

Most hosting providers support custom domains:

- Vercel: Project settings → Domains
- Netlify: Site settings → Domain management
- Add DNS records at your domain provider

### 3. Enable Analytics (Optional)

Add Google Analytics or similar:

```html
<!-- In index.html, before </head> -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

---

## 🔄 Future: Backend Integration

When ready to connect a real backend:

1. **Update environment variables**:

   ```env
   VITE_API_BASE_URL=https://api.yourdomain.com
   ```

2. **Replace mock API**:
   - Modify `src/services/mockApi.js`
   - Use `fetch` or `axios` for real API calls
   - Handle authentication tokens

3. **Add environment-specific configs**:
   ```js
   const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
   ```

---

## 📊 Build Statistics

- **Total bundle size**: 112.61 kB (gzipped)
- **Assets**: JavaScript, CSS, HTML
- **Code splitting**: React vendor, Charts separated
- **Optimization**: Minified, tree-shaken, optimized

---

## 🐛 Troubleshooting

### Blank page after deployment

- **Cause**: Base URL configuration
- **Fix**: Ensure `vite.config.js` has correct `base` setting

### 404 errors on routes

- **Cause**: Server not configured for SPA
- **Fix**: Add redirect rules (see hosting section above)

### Assets not loading

- **Cause**: Incorrect asset paths
- **Fix**: Ensure all paths use relative imports

---

## 🎉 Your App is Ready!

The Globopersona platform is fully functional and deployment-ready. Choose any deployment option above and go live in minutes!

**Recommended**: Start with Vercel for the easiest, zero-config deployment experience.
