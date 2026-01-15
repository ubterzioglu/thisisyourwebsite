# thisisyour.website

Ücretsiz kişisel web sitesi çekilişi ve parametre toplama sistemi. LinkedIn çekilişi için geliştirilmiş, kullanıcılar wizard ile form doldurur, sonuçlar Supabase'de saklanır.

---

## 📋 İçindekiler

1. [Proje Özeti](#proje-özeti)
2. [Hızlı Başlangıç](#hızlı-başlangıç)
3. [Kurulum](#kurulum)
4. [Sayfalar ve Özellikler](#sayfalar-ve-özellikler)
5. [Teknik Detaylar](#teknik-detaylar)
6. [API Endpoints](#api-endpoints)
7. [Todo List](#todo-list)
8. [Değişiklik Geçmişi](#değişiklik-geçmişi)

---

## 🎯 Proje Özeti

**thisisyour.website** - LinkedIn çekilişi için ücretsiz kişisel web sitesi parametre toplama sistemi. Kullanıcılar 20 soruluk wizard ile web sitesi tercihlerini belirtir, sonuçlar otomatik özetlenir ve AI prompt oluşturulur.

### Özellikler

- ✅ **Minimal Landing Page**: LinkedIn post linki ve wizard başlatma butonu
- ✅ **20 Soru Wizard**: Adım adım soru-cevap akışı
- ✅ **Otomatik Özet**: Kullanıcı dostu Türkçe özet + AI prompt
- ✅ **Sonuç Sayfası**: Gönderim özeti görüntüleme
- ✅ **Turso Entegrasyonu**: API endpoint'leri üzerinden veritabanı erişimi
- ✅ **Slug Tabanlı Erişim**: Her gönderim için benzersiz URL
- ✅ **GoatCounter Analytics**: Tüm sayfalarda ziyaret istatistikleri
- ✅ **Admin Paneli**: Sıra yönetimi (eski sistem - token bazlı)
- ✅ **Tamamlanan Siteler Showcase**: Ana sayfada gösterim

### Teknoloji Stack

- **Frontend**: Vanilla HTML/CSS/JS (ES6 Modules)
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Turso (SQLite - Serverless)
- **Deployment**: Vercel + GitHub
- **Analytics**: GoatCounter

---

## 🚀 Hızlı Başlangıç

### 1. Repository'yi Clone'layın

```bash
git clone https://github.com/ubterzioglu/thisisyourwebsite.git
cd thisisyourwebsite
```

### 2. Turso Database Kurulumu

1. **Vercel Marketplace Entegrasyonu (Önerilen)**:
   - Vercel Dashboard → Project Settings → Integrations
   - "Turso" arayın ve "Add Integration" tıklayın
   - Yeni database oluşturun: `thisisyourwebsite`
   - Environment variables otomatik eklenir!

2. **Alternatif: Manuel Kurulum**:
   - [Turso Dashboard](https://turso.tech) üzerinde hesap oluşturun
   - Database oluşturun
   - Database URL ve Auth Token alın
   - Vercel Dashboard → Environment Variables'a ekleyin:
     - `TURSO_DATABASE_URL`
     - `TURSO_AUTH_TOKEN`

### 3. Dependencies Kurulumu

```bash
npm install
```

### 4. Schema Migration

Turso Dashboard → SQL Editor'da `turso-schema.sql` dosyasını çalıştırın.

Veya CLI ile:
```bash
turso db shell thisisyourwebsite < turso-schema.sql
```

### 5. Vercel Deployment

1. GitHub'a push edin
2. Vercel Dashboard'da projeyi import edin (eğer yoksa)
3. Environment Variables kontrol edin:
   - `TURSO_DATABASE_URL` ✅
   - `TURSO_AUTH_TOKEN` ✅
   - `ADMIN_PASSWORD`
   - `ZOHO_SMTP_HOST`, `ZOHO_SMTP_PORT`, `ZOHO_SMTP_USER`, `ZOHO_SMTP_PASS`
   - `MAIL_FROM`, `MAIL_TO`
4. Deploy!

---

## 📦 Kurulum

### Gereksinimler

- Node.js 18+
- Vercel CLI (opsiyonel, local dev için)
- Turso hesabı (veya Vercel Marketplace entegrasyonu)

### Local Development

```bash
# Dependencies kurulumu (gerekirse)
npm install

# Vercel CLI ile local dev
npm install -g vercel
vercel link
vercel env pull
vercel dev
```

Veya basit HTTP server:

```bash
python -m http.server 8000
# http://localhost:8000
```

---

## 📄 Sayfalar ve Özellikler

### 1. Landing Page (`index.html`)

**URL**: `/`

**Özellikler**:
- Minimal tek kartlı tasarım
- LinkedIn post linki (external)
- "Yorum Yaptım Bile!" butonu → `yes.html`'e yönlendirir
- GoatCounter analytics

**Kullanım**:
- Kullanıcılar buradan wizard'a başlar
- LinkedIn çekilişi için giriş noktası

### 2. Wizard Sayfası (`yes.html`)

**URL**: `/yes.html` (slug otomatik oluşturulur: `?slug=XXXX`)

**Özellikler**:
- 20 soru adım adım gösterim
- Progress bar (Soru X / 20)
- İleri/Geri navigasyon
- Son adım: Ek notlar (uzun metin)
- Otomatik slug oluşturma
- Supabase'e kayıt

**Soru Tipleri**:
- **Tek Seçim**: Radio buttons
- **Çoklu Seçim**: Checkboxes
- **Metin**: Text input
- **Evet/Hayır**: Boolean buttons
- **Uzun Metin**: Textarea

**Akış**:
1. Kullanıcı wizard'a girer
2. Slug otomatik oluşturulur ve URL'ye eklenir
3. `intakes` tablosunda `status: 'in_progress'` kaydı oluşturulur
4. Kullanıcı 20 soruyu doldurur
5. "Bitir" butonuna basılır
6. `buildUserSummary()` ile kullanıcı özeti oluşturulur
7. `buildAiPrompt()` ile AI prompt oluşturulur
8. API endpoint üzerinden Turso'ya kaydedilir (`status: 'submitted'`)
9. `result.html?slug=XXXX` sayfasına yönlendirilir

### 3. Sonuç Sayfası (`result.html`)

**URL**: `/result.html?slug=XXXX`

**Özellikler**:
- İki kart gösterimi:
  - **20 Soru Özeti**: Kullanıcı dostu Türkçe özet
  - **Ek Notlarınız**: Uzun metin (aynen gösterilir)
- "Başa Dön" butonu
- Slug ile veritabanından veri çekme

**Not**: AI prompt kullanıcıya gösterilmez, sadece veritabanında saklanır.

### 4. Admin Paneli (`admin.html`)

**URL**: `/admin.html`

**Özellikler**:
- Şifre korumalı giriş
- Sıra yönetimi (eski token bazlı sistem)
- Yeni öğe oluşturma
- Gönderim detaylarını görüntüleme
- Teslim işaretleme

**Not**: Bu panel eski token bazlı sistem için. Wizard sistemi ayrı çalışır.

### 5. Apply Sayfası (`apply.html`)

**URL**: `/apply.html?token=XXXX`

**Özellikler**:
- Token bazlı erişim (eski sistem)
- 20 soruluk form (wizard'dan farklı)
- Admin paneli ile entegre

### 6. Form Sayfası (`form.html`)

**Not**: Eski form sayfası. Artık `yes.html` kullanılıyor.

---

## 🔧 Teknik Detaylar

### Veritabanı Şeması

#### `intakes` Tablosu (Wizard Sistemi - Turso/SQLite)

```sql
CREATE TABLE IF NOT EXISTS intakes (
  id TEXT PRIMARY KEY,
  created_at TEXT DEFAULT (datetime('now')),
  public_slug TEXT UNIQUE NOT NULL,
  answers TEXT NOT NULL DEFAULT '{}',
  long_text TEXT,
  user_summary TEXT,
  ai_prompt TEXT,
  status TEXT DEFAULT 'submitted',
  updated_at TEXT DEFAULT (datetime('now'))
);
```

**Alanlar**:
- `public_slug`: Kullanıcı erişimi için benzersiz slug (base64url, ~24 karakter)
- `answers`: 20 sorunun cevapları (JSON string olarak saklanır)
- `user_summary`: Kullanıcı gösterimi için Türkçe özet
- `ai_prompt`: AI için yapılandırılmış prompt string
- `long_text`: Son adımdaki uzun metin
- `status`: `in_progress` | `submitted`

**Not**: Turso (SQLite) kullanıldığı için UUID yerine TEXT, JSONB yerine TEXT (JSON string) kullanılır.

#### `queue_items` Tablosu (Admin Sistemi)

Token bazlı eski sistem için.

#### `submissions` Tablosu (Admin Sistemi)

Token bazlı gönderimler için.

### Dosya Yapısı

```
thisisyourwebsite/
├── index.html              # Landing page
├── yes.html                # 20 soru wizard
├── wizard.js               # Wizard mantığı
├── result.html             # Sonuç sayfası
├── result.js               # Result mantığı
├── lib/
│   └── tursoClient.js      # Turso client helper
├── config/
│   └── questions.js        # 20 soru tanımları
├── admin.html              # Admin paneli (eski sistem)
├── apply.html              # Token bazlı form (eski sistem)
├── form.html               # Eski form sayfası
├── assets/
│   ├── styles.css          # Global CSS
│   ├── app.js              # Landing page JS
│   ├── admin.js            # Admin paneli JS
│   └── apply.js            # Apply form JS
├── api/                    # Vercel Serverless Functions
│   ├── public.js
│   ├── apply-validate.js
│   ├── apply-submit.js
│   └── admin-*.js
├── supabase-schema.sql     # Eski Supabase şeması (referans)
├── turso-schema.sql        # Turso (SQLite) şeması
├── vercel.json             # Vercel config
└── package.json
```

### Wizard Soruları

20 soru `config/questions.js` dosyasında tanımlı:

1. Web sitenizin ana amacı (tek seçim)
2. Adınız ve Soyadınız (metin)
3. Profesyonel başlık/Unvanınız (metin)
4. Web sitesi hangi dillerde olsun (çoklu)
5. Hangi bölümler olsun (çoklu)
6. Hangi iletişim yöntemleri gösterilsin (çoklu)
7. Hangi sosyal medya linklerini ekleyelim (çoklu)
8. Profesyonel fotoğrafınız var mı (evet/hayır)
9. Tasarım tarzı (tek seçim)
10. Ana renk tercihi (tek seçim)
11. Ana çağrı butonu stili (tek seçim)
12. İçerik üslubu (tek seçim)
13. Öne çıkarılacak 3 özellik (çoklu)
14. Şu anki çalışma durumunuz (tek seçim)
15. Konum bilgisi gösterilsin mi (evet/hayır)
16. Referanslar/Testimonial eklenmeli mi (evet/hayır)
17. Kaç proje gösterilsin (tek seçim)
18. Blog bölümü olsun mu (evet/hayır)
19. CV indirme butonu olsun mu (evet/hayır)
20. Tercih ettiğiniz domain/username (tek seçim)

+ Ek Notlar (uzun metin)

### Özet Üretimi

#### `buildUserSummary(answers)`

Kullanıcı gösterimi için Türkçe özet oluşturur:
- Her soru için `summaryTemplate` kullanılır
- Örnek: "Sitenin amacı: Portföy"
- Satır satır gösterilir

#### `buildAiPrompt(answers, longText)`

AI için yapılandırılmış prompt oluşturur:
- Her soru için `promptTemplate` kullanılır
- Structured format (İngilizce/Türkçe karışık)
- Uzun metin "Additional Notes" olarak eklenir


### Analytics

GoatCounter analytics tüm HTML sayfalarında aktif:

```html
<script data-goatcounter="https://thisisyourwebsite.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

---

## 🔌 API Endpoints

### Public Endpoints

- `GET /api/public` - Tamamlanan siteleri döner (showcase)

### Wizard Endpoints

- `GET /api/intakes?slug=XXXX` - Intake kaydını getir
- `POST /api/intakes` - Yeni intake kaydı oluştur
- `PUT /api/intakes?slug=XXXX` - Intake kaydını güncelle

### Admin Endpoints (Eski Sistem)

- `GET /api/apply-validate?token=...` - Token doğrulama
- `POST /api/apply-submit` - Form gönderimi
- `POST /api/admin/login` - Admin girişi
- `POST /api/admin/logout` - Admin çıkışı
- `GET /api/admin/queue?admin=1` - Sıra listesi
- `POST /api/admin/queue-create` - Yeni öğe oluştur
- `POST /api/admin/queue-update` - Öğe güncelle
- `GET /api/admin/submission?id=...` - Gönderim detayları

---

## ✅ Yapılan Geliştirmeler

### Tamamlanan Özellikler

- ✅ **Turso Migration**: Supabase'den Turso (SQLite) veritabanına geçiş
  - `package.json`: @supabase/supabase-js → @libsql/client
  - `turso-schema.sql`: SQLite uyumlu schema oluşturuldu
  - `lib/tursoClient.js`: Turso client helper eklendi
  - `api/intakes.js`: Wizard için API endpoint eklendi
  - `wizard.js` ve `result.js`: API endpoint kullanacak şekilde güncellendi
  - Browser'dan direkt DB bağlantısı kaldırıldı (API üzerinden çalışıyor)

---

## 📋 Kullanıcının Yapması Gerekenler

### Yüksek Öncelik (Zorunlu)

1. **Turso Schema Migration**
   - Turso Dashboard → Database → SQL Editor
   - `turso-schema.sql` dosyasındaki SQL'i çalıştırın
   - Veya Turso CLI ile: `turso db shell thisisyourwebsite < turso-schema.sql`
   - **Neden**: Tabloların oluşturulması için zorunlu

2. **Dependencies Kurulumu**
   - Terminal'de: `npm install`
   - Yeni dependency (@libsql/client) kurulacak
   - **Neden**: API endpoint'lerinin çalışması için gerekli

3. **Environment Variables Kontrolü (Vercel)**
   - Vercel Dashboard → Project Settings → Environment Variables
   - Şu değişkenlerin olduğundan emin olun:
     - `TURSO_DATABASE_URL` (zaten eklendi ✅)
     - `TURSO_AUTH_TOKEN` (zaten eklendi ✅)
     - `ADMIN_PASSWORD`
     - `ZOHO_SMTP_HOST` (örn: `smtp.zoho.eu`)
     - `ZOHO_SMTP_PORT` (örn: `465`)
     - `ZOHO_SMTP_USER` (Zoho email adresiniz)
     - `ZOHO_SMTP_PASS` (Zoho app password)
     - `MAIL_FROM` (Gönderen email adresi)
     - `MAIL_TO` (Form gönderimlerinin iletileceği email)
   - **Neden**: Uygulamanın çalışması ve email bildirimleri için gerekli

### Orta Öncelik (Önerilen)

4. **Test ve Doğrulama**
   - Wizard akışını test edin: `yes.html` → formu doldurun → `result.html` kontrolü
   - API endpoint'lerinin çalıştığını doğrulayın
   - **Neden**: Sistemin düzgün çalıştığından emin olmak için

5. **Eski Supabase Referanslarını Temizleme** (İsteğe bağlı)
   - `supabase-schema.sql` dosyası artık kullanılmıyor (referans için tutulabilir)
   - Eski Supabase environment variables'ları kaldırılabilir
   - **Neden**: Karmaşıklığı azaltmak için

### İsteğe Bağlı

6. **Admin Panel Migration** (İleride)
   - Admin paneli endpoint'lerini Turso'ya uyarlama
   - `queue_items` ve `submissions` tablolarını Turso'ya migrate etme
   - **Not**: Şu an sadece wizard sistemi Turso kullanıyor, admin paneli eski sistemde

7. **Email Bildirim Servisi** (İleride)
   - Resend, SendGrid veya benzeri bir servis
   - API key alın
   - Vercel environment variables'a ekleyin

---

## 📝 Değişiklik Geçmişi

### 2026-01-14

#### Güvenlik ve İyileştirmeler

- ✅ **Supabase RLS Politikaları**: `intakes` tablosu için Row Level Security politikaları eklendi
  - Anonymous kullanıcılar için insert/update/select politikaları
  - Service role için full access politikası
  - SQL: `supabase-schema.sql` dosyasına eklendi

#### Yeni Özellikler

- ✅ **Wizard Sistemi**: 20 soruluk adım adım form sistemi (`yes.html`, `wizard.js`)
- ✅ **Result Sayfası**: Gönderim özeti görüntüleme (`result.html`, `result.js`)
- ✅ **Supabase `intakes` Tablosu**: Wizard gönderimleri için yeni tablo
- ✅ **Otomatik Özet Üretimi**: `buildUserSummary()` ve `buildAiPrompt()` fonksiyonları
- ✅ **Slug Tabanlı Erişim**: Her gönderim için benzersiz slug oluşturma
- ✅ **Browser Supabase Entegrasyonu**: CDN üzerinden Supabase client kullanımı
- ✅ **Config Sistemi**: `config.js` ve `config/questions.js` dosyaları
- ✅ **GoatCounter Analytics**: Tüm HTML sayfalarına analytics script eklendi

#### Landing Page Güncellemeleri

- ✅ Minimal tek kartlı tasarım
- ✅ "Yorum Yaptım Bile!" butonu → `yes.html`'e yönlendirme
- ✅ LinkedIn post linki entegrasyonu

#### Dokümantasyon

- ✅ README.md tamamen yeniden yazıldı
- ✅ "Kullanıcının Yapması Gerekenler" bölümü eklendi
- ✅ Teknik detaylar güncellendi

---

## 📞 İletişim ve Destek

- **GitHub**: https://github.com/ubterzioglu/thisisyourwebsite
- **Website**: https://thisisyour.website

---

**Son Güncelleme**: 2026-01-14  
**Versiyon**: 2.0.0  
**Lisans**: © 2026 thisisyour.website
