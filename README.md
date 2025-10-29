# Mobiversite E-Commerce

Modern bir e-ticaret uygulaması. Next.js 14, TypeScript, Context API ve Tailwind CSS ile geliştirildi.

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

## 🌐 Deploy (Yayınlama)

Bu proje iki ayrı serviste deploy edilmelidir:

### 1. API'yi Render'da Deploy Etme

1. [Render.com](https://render.com) hesabı oluşturun
2. "New +" > "Web Service" seçin
3. GitHub reponuzu bağlayın
4. Ayarları yapın:
   - **Name**: `mobiversite-api` (istediğiniz isim)
   - **Root Directory**: `api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. "Create Web Service" butonuna tıklayın
6. Deploy tamamlandığında size bir URL verilecek (örn: `https://mobiversite-api.onrender.com`)

### 2. Frontend'i Vercel'de Deploy Etme

1. [Vercel.com](https://vercel.com) hesabı oluşturun
2. "Add New" > "Project" seçin
3. GitHub reponuzu import edin
4. Environment Variables ekleyin:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-url.onrender.com
   ```
   (Render'dan aldığınız API URL'ini buraya yapıştırın)
5. "Deploy" butonuna tıklayın
6. Deploy tamamlandı! 🎉

### Önemli Notlar

- ⚠️ Render'ın ücretsiz planında inaktif kalırsa servis uyku moduna geçer (ilk istek 1-2 dakika sürebilir)
- ⚠️ Render'da her yeniden başlatmada `db.json` sıfırlanır (bu bir demo proje olduğu için sorun değil)
- 💡 Production için MongoDB gibi gerçek bir veritabanı kullanmanızı öneririm

## 🔐 Test Kullanıcıları

```
Email: john@gmail.com
Password: m38rmF$

Email: morrison@gmail.com  
Password: 83r5^_
```

## 🛠️ Teknolojiler

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

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

## 📄 Lisans

MIT
