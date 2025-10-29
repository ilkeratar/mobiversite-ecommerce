# Mobiversite E-Commerce

Modern bir e-ticaret uygulaması. Next.js 15, TypeScript, Context API ve Tailwind CSS ile geliştirildi.

## 🚀 Özellikler

- ✅ Ürün listeleme ve detay sayfaları
- ✅ Kategori filtreleme
- ✅ Sepet yönetimi
- ✅ Kullanıcı girişi ve kayıt
- ✅ Wishlist (Favori Listesi)
- ✅ Sipariş geçmişi
- ✅ Profil yönetimi
- ✅ Responsive tasarım

## 📦 Kurulum

### Gereksinimler

- Node.js 14+ 
- npm veya yarn

### Lokal Geliştirme

1. **Projeyi klonlayın:**
```bash
git clone <repo-url>
cd mobiversite-ecommerce
```

2. **Frontend bağımlılıklarını yükleyin:**
```bash
npm install
```

3. **API bağımlılıklarını yükleyin:**
```bash
cd api
npm install
cd ..
```

4. **API sunucusunu başlatın:**
```bash
cd api
npm start
# Port 3001'de çalışacak
```

5. **Frontend'i başlatın (yeni terminal):**
```bash
npm run dev
# Port 3000'de çalışacak
```

6. **Tarayıcıda açın:**
- Frontend: http://localhost:3000
- API: http://localhost:3001


## 🔐 Test Kullanıcıları

Email: john@gmail.com
Password: m38rmF$

Email: morrison@gmail.com  
Password: 83r5^_

## 🛠️ Tech Stack

### Frontend
- Next.js 15 (App Router + Turbopack)
- React 19
- TypeScript
- Tailwind CSS 4
- Context API (State Management)
- Axios

### Backend
- Express.js
- CORS
- File-based JSON Database

## 📁 Proje Yapısı

```
mobiversite-ecommerce/
├── api/                    # Backend API
│   ├── server.js          # Express server
│   ├── package.json
│   └── .gitignore
├── app/                    # Next.js pages
├── components/            # React components
├── context/              # Context API
├── lib/                  # Utilities
├── services/             # API services
├── types/                # TypeScript types
├── db.json              # Database
└── README.md
```