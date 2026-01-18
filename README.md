# 🛫 JOLIE TOURS - Application de Recherche de Vols

## ✨ Caractéristiques

✅ **API Paximum fonctionnelle** - Recherche de vols en temps réel  
✅ **Design ultra-luxe** - #0B0B0B + #C9A24D + ✦  
✅ **Next.js 14** - App Router + API Routes  
✅ **TypeScript** - Code type-safe  
✅ **Zero CORS** - Backend intégré  
✅ **Responsive** - Mobile + Desktop  

---

## 🚀 Déploiement sur Vercel

### Option 1 : Via GitHub (RECOMMANDÉ)

1. **Push sur GitHub:**
   ```bash
   cd jolie-tours-app
   git init
   git add .
   git commit -m "Initial commit - Jolie Tours flight search"
   git branch -M main
   git remote add origin https://github.com/Isa0565/Jolie-tours-.git
   git push -u origin main
   ```

2. **Importer dans Vercel:**
   - Va sur https://vercel.com
   - Clique "New Project"
   - Importe "Isa0565/Jolie-tours-"
   - Framework: Next.js (auto-détecté)
   - Deploy!

### Option 2 : Via Vercel CLI

```bash
npm install -g vercel
cd jolie-tours-app
vercel --prod
```

---

## 🧪 Test en Local

```bash
cd jolie-tours-app
npm install
npm run dev
```

Ouvre http://localhost:3000/search

---

## 📋 Structure

```
jolie-tours-app/
├── app/
│   ├── api/
│   │   └── paximum/
│   │       └── search/
│   │           └── route.ts          # API Paximum
│   ├── search/
│   │   └── page.tsx                  # Page de recherche
│   └── layout.tsx                    # Layout principal
├── package.json
├── next.config.js
└── tsconfig.json
```

---

## 🎯 Endpoints

### `/api/paximum/search` (POST)

**Request:**
```json
{
  "from": "BRU",
  "to": "IST",
  "departureDate": "2026-03-15",
  "returnDate": "2026-03-22",
  "adult": 2,
  "child": 0,
  "infant": 0,
  "cabin": "1"
}
```

**Response:**
```json
{
  "success": true,
  "searchId": "uuid",
  "offers": [
    {
      "offerId": "...",
      "price": 250.50,
      "currency": "EUR",
      "airline": "Turkish Airlines",
      "stops": 0,
      "duration": "3h 30m",
      "cabinClass": "Economy"
    }
  ],
  "totalResults": 25
}
```

---

## 🔐 Configuration

Credentials Paximum (hardcodés dans `/app/api/paximum/search/route.ts`):
- Agency: PXM25952
- User: USR1
- Password: !23
- URL: http://service.stage.paximum.com/v2

**⚠️ POUR PRODUCTION:** Utiliser des variables d'environnement dans Vercel.

---

## 🎨 Design DNA

- **Background**: #0B0B0B (charcoal black)
- **Gold**: #C9A24D (matte gold)
- **Dark Gray**: #1F1F1F (warm gray)
- **Text**: #F5F5F5 (off-white)
- **Symbol**: ✦ (partout)

---

## ✅ Next Steps

1. ✅ Déployer sur Vercel
2. ⏳ Ajouter BeginTransaction
3. ⏳ Intégrer Stripe
4. ⏳ Créer page de réservation
5. ⏳ Admin dashboard

---

**Créé pour Isa Taspinar - Jolie Tours ✦**
