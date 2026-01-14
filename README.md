# thisisyour.website - Tüm Dokümantasyon

Bu dosya projenin tüm dokümantasyonunu içerir: spesifikasyonlar, kurulum rehberi, sohbet geçmişi ve teknik detaylar.

---

## İçindekiler

1. [Proje Özeti](#proje-özeti)
2. [Kurulum ve Kullanım Rehberi](#kurulum-ve-kullanım-rehberi)
3. [Proje Spesifikasyonu](#proje-spesifikasyonu)
4. [Agent Spesifikasyonları](#agent-spesifikasyonları)
5. [Sohbet Geçmişi ve Geliştirme Süreci](#sohbet-geçmişi-ve-geliştirme-süreci)

---

## Proje Özeti

**thisisyour.website** - Ücretsiz kişisel web sitesi sıra yönetimi ve form sistemi. LinkedIn çekilişi için geliştirilmiş, müşteriler token ile form doldurur, admin sırayı yönetir.

### Özellikler

- ✅ Sadece Türkçe dil desteği
- ✅ Minimal, premium tasarım
- ✅ Karanlık/Açık tema desteği
- ✅ Admin paneli (şifre korumalı)
- ✅ Token tabanlı form erişimi
- ✅ 20 soruluk detaylı form
- ✅ Otomatik özet üretimi (müşteri + AI okunabilir)
- ✅ Tamamlanan siteler showcase'de gösterilir
- ✅ Supabase Postgres veritabanı
- ✅ Vercel Serverless Functions

### Teknoloji Stack

- **Frontend**: Vanilla HTML/CSS/JS
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Supabase Postgres
- **Deployment**: Vercel + GitHub

---

## Kurulum ve Kullanım Rehberi

### 1. Supabase Kurulumu

1. [Supabase](https://supabase.com) üzerinde yeni bir proje oluşturun
2. SQL Editor'a gidin ve `supabase-schema.sql` dosyasındaki SQL'i çalıştırın
3. Project Settings > API bölümünden şunları not edin:
   - Project URL (SUPABASE_URL)
   - Service Role Key (SUPABASE_SERVICE_ROLE_KEY)

### 2. Vercel Kurulumu

1. Bu repository'yi GitHub'a push edin
2. [Vercel Dashboard](https://vercel.com/dashboard) üzerinden:
   - "New Project" → "Import Git Repository"
   - Repository'nizi seçin
   - Environment Variables ekleyin:
     ```
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ADMIN_PASSWORD=your_secure_password
     ```
   - Deploy!

### 3. Local Development

```bash
# Vercel CLI'ı yükleyin
npm install -g vercel

# Projeyi bağlayın
vercel link

# Environment variables'ları çekin
vercel env pull

# Local'de çalıştırın
vercel dev
```

### Kullanım

#### Admin Paneli İşlemleri

1. **Yeni Müşteri Ekleme**:
   - `/admin.html` sayfasına gidin
   - Admin şifresi ile giriş yapın
   - "Yeni Öğe" butonuna tıklayın
   - İsim ve rol bilgilerini girin
   - Showcase iznini seçin (Herkese Açık / Anonim / Gizli)
   - Token linki otomatik oluşturulur

2. **Müşteriye Link Gönderme**:
   - Sıra tablosunda "Link" butonuna tıklayın
   - Link otomatik kopyalanır
   - Müşteriye gönderin: `https://yoursite.com/apply.html?token=XXXX`

3. **Gönderimleri İnceleme**:
   - Sıra tablosunda "Detay" butonuna tıklayın
   - Müşteri özetini görüntüleyin
   - AI JSON payload'unu kopyalayın (kişisel site oluşturmak için)

4. **Teslim İşaretleme**:
   - Site hazır olduğunda, detay modalında:
   - Site URL'sini girin
   - Repo URL'sini (opsiyonel) girin
   - "Teslimat Bilgilerini Kaydet" butonuna tıklayın
   - Durum otomatik olarak "Teslim Edildi" olarak güncellenir
   - Site showcase'de görünür hale gelir

#### Günlük İşlem Akışı

1. **Davet Et** → Admin panelinden yeni öğe oluştur, link gönder
2. **Gönderim Al** → Müşteri formu doldurur, özet oluşturulur
3. **Site Oluştur** → AI JSON payload'unu kullanarak site oluştur
4. **Teslim Et** → Site URL'sini ekle, durumu güncelle
5. **Showcase** → Tamamlanan siteler ana sayfada görünür

### API Endpoints

- `GET /api/public` - Tamamlanan siteleri döner (public)
- `GET /api/apply/validate?token=...` - Token doğrulama
- `POST /api/apply/submit` - Form gönderimi
- `POST /api/admin/login` - Admin girişi
- `POST /api/admin/logout` - Admin çıkışı
- `GET /api/admin/queue?admin=1` - Sıra listesi (admin only)
- `POST /api/admin/queue/create` - Yeni sıra öğesi oluştur (admin only)
- `POST /api/admin/queue/update` - Sıra öğesi güncelle (admin only)
- `GET /api/admin/submission?id=...` - Gönderim detayları (admin only)

### Güvenlik

- Admin endpoint'leri şifre + session cookie ile korunur
- Token'lar tahmin edilemez (24+ karakter base64url)
- Public API gizlilik ayarlarına uyar (PRIVATE gösterilmez)
- Service Role Key sadece serverless functions'da kullanılır

### Form Yapısı

20 soru:
- **5 Evet/Hayır**: Fotoğraf, iletişim formu, sosyal linkler, portföy, referanslar
- **5 Tek Seçim**: Sektör, renk paleti, içerik odağı, üslup, çağrı tipi
- **4 Çoklu Seçim**: Beceriler, sosyal platformlar, içerik bölümleri, diller
- **5 Kısa Metin**: Ad Soyad, Unvan, E-posta, Konum, Şirket
- **1 Uzun Metin**: Profesyonel özet

---

## Proje Spesifikasyonu

### Genel Bakış

Ücretsiz kişisel web sitesi sıra yönetimi ve form sistemi. LinkedIn çekilişi için geliştirilmiş, müşteriler token ile form doldurur, admin sırayı yönetir.

### Sayfalar

#### 1. Landing Page (/)
- Minimal hero bölümü
- Program açıklaması
- Tamamlanan siteler showcase'i (isim, rol, site URL'si)
- Karanlık/Açık tema toggle (localStorage'da saklanır)

#### 2. Başvuru Sayfası (/apply.html?token=XXXX)
- Token ile erişim
- 20 soruluk form:
  - 5 Evet/Hayır
  - 5 Tek seçim
  - 4 Çoklu seçim
  - 5 Kısa metin
  - 1 Uzun metin
- Gönderim sonrası:
  - Teşekkür ekranı
  - Türkçe özet gösterimi
  - Özet kopyalama butonu

#### 3. Admin Paneli (/admin.html)
- Şifre ile giriş
- Sıra yönetimi tablosu
- Özellikler:
  - Sıra öğesi oluştur (isim, rol, showcase izni)
  - Token linki oluştur ve kopyala
  - Gönderim detaylarını görüntüle (cevaplar, özetler, AI JSON)
  - Teslim edildi olarak işaretle (site URL, repo URL ekle)
  - Sıra numarası ve durum düzenleme

### Veritabanı Şeması

#### queue_items Tablosu
- id (uuid)
- order_index (int)
- display_name (text)
- display_role (text nullable)
- token (text unique, 24+ karakter)
- status (enum: INVITED, SUBMITTED, IN_PROGRESS, DELIVERED)
- consent_showcase (enum: PUBLIC, ANONYMIZED, PRIVATE)
- site_url (text nullable)
- repo_url (text nullable)
- created_at (timestamp)
- updated_at (timestamp)
- delivered_at (timestamp nullable)

#### submissions Tablosu
- id (uuid)
- queue_item_id (uuid fk)
- preferred_language (text: tr)
- answers_json (jsonb)
- customer_summary_tr (text)
- ai_payload_json (jsonb)
- submitted_at (timestamp)

### Tasarım
- Max-width: 960px
- Bol beyaz boşluk
- Minimal grayscale + accent renk
- Hafif hover ve transition efektleri
- Sistem font stack

### Ortam Değişkenleri
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_PASSWORD
- APP_BASE_URL (opsiyonel)

---

## Agent Spesifikasyonları

### AGENT_SPEC — thisisyour.website
## Personal Website Quote Builder + Premium Lead Engine

THIS IS THE SINGLE SOURCE OF TRUTH.
DO NOT SIMPLIFY.
DO NOT OMIT.
DO NOT INTERPRET.
FOLLOW VERBATIM.

### 0) VISION

thisisyour.website is a premium, Gen‑Z friendly, conversion‑first system that:
- helps users understand what kind of personal website they need,
- removes uncertainty in under 2 minutes,
- generates a human‑readable project summary,
- produces high‑intent leads,
- replies within 24 hours with a tailored offer.

The system is intentionally:
- lightweight
- fast
- SEO + GEO optimized
- technology‑agnostic

### 1) TECHNOLOGY PARAMETERIZATION (MANDATORY)

#### Runtime Parameters

TECH_STACK = jsx-next | vanilla  
DEPLOY_TARGET = vercel | netlify | static  
FORM_DELIVERY = email | api  
BRAND_MODE = surprise-me | user-provided-palette  

#### Non‑negotiable Output

Regardless of parameters, the agent MUST deliver:
- Landing page
- 20-step wizard
- Editable summary page
- Submission success screen
- Email delivery (Phase 1)
- SEO + GEO compliance
- Mobile‑first UX
- Fast load, minimal JS

### 2) LANDING PAGE

#### Visual Direction
- White dominant background
- Modern typography
- Spacious layout
- Subtle gradients or accents
- Micro-interactions only

If BRAND_MODE=surprise-me:
- Choose 1 bold accent color
- Choose 1 warm secondary color
- Define neutral grayscale
- Justify palette in comments

#### Sections (Order is fixed)

1. Hero
   - Clear benefit-driven headline
   - "2 minutes", "no commitment" reassurance
   - Primary CTA: Get your quote
   - Secondary CTA: See how it works

2. How It Works
   - Answer questions
   - Review summary
   - Get offer in 24h

3. What You Get
   - Personal website
   - SEO ready
   - Mobile-first
   - Clean and modern

4. Trust Signals
   - Reply within 24h
   - No spam

5. FAQ (schema-ready)

### 3) WIZARD SYSTEM

#### Global UX Rules
- One question per screen
- Progress indicator (1/20)
- Back / Next
- Required fields visible
- Autosave answers
- Keyboard accessible

### 4) THE 20 QUESTIONS (CONTRACT)

Q1 Project Goal (single)
Q2 Domain owned (yes/no)
Q3 Website type (single)
Q4 Pages (multi)
Q5 Content readiness (single)
Q6 Copywriting help (yes/no)
Q7 Languages (multi)
Q8 Visual style (single)
Q9 Color preference (single)
Q10 Typography vibe (single)
Q11 Logo need (single)
Q12 Images (multi)
Q13 Features (multi)
Q14 Integrations (multi optional)
Q15 Mobile priority (single)
Q16 Deadline (single)
Q17 Maintenance (single)
Q18 Hosting (single)
Q19 Contact email (required)
Q20 Additional notes (long text)

Agent MUST implement exactly these 20.

### 5) PREMIUM CONVERSION FEATURES

#### A) Instant Preview Templates
- Triggered by Q8
- Show 2–3 abstract template cards
- Selection influences summary only

#### B) Real‑Time Complexity Meter
- Sticky indicator
- Updates live
- Shows Basic / Standard / Pro / Custom
- Optional non-binding price range

#### C) AI Content Starter Pack
Triggered if:
- Q5 = Not ready
- OR Q6 = Yes

Generate:
- About Me draft
- Services bullets
- 5 hero headline ideas

Read-only preview.
Included in summary + email.

#### D) Multi‑Channel Contact
After email:
- Preferred contact method
- Email mandatory
- WhatsApp / Telegram optional

#### E) Social Proof Signals
- "Average response <24h"
- Optional request counter

### 6) SUMMARY PAGE

#### Structure
1. Goals
2. Pages
3. Visual direction
4. Content status
5. Features
6. Timeline
7. Maintenance
8. Contact preference
9. Additional notes

#### Behavior
- Fully editable
- Instant updates

### 7) EFFORT SCORE

Base = 10

Add:
- Multi-page +10
- Blog +12
- Copywriting +8
- Extra language +6
- Premium logo +6
- Stock/AI images +4
- Each feature +1 (max 10)
- ASAP deadline +6
- Maintenance +5

Labels:
- 10–18 Basic
- 19–30 Standard
- 31–45 Pro
- 46+ Custom

Used for:
- Live meter
- Summary headline
- Email subject

### 8) EMAIL DELIVERY

Subject:
New Quote Request — thisisyour.website — {Complexity}

Body:
- Contact info
- Complexity + score
- Visual choices
- Generated drafts
- Full answers
- Timestamp

Tone: professional, scannable.

### 9) SEO + GEO

SEO:
- Semantic HTML
- Meta tags
- OG/Twitter
- Sitemap + robots.txt

GEO:
- Clear service description
- Bullet deliverables
- Process steps
- FAQ schema
- Internal links

### 10) IMPLEMENTATION

#### Vanilla
- HTML / CSS / JS
- Netlify Forms or Formspree

#### JSX / Next
- App Router
- Client wizard
- Serverless email
- Metadata API

### 11) QUALITY GATES

- Lighthouse good
- Mobile UX excellent
- No heavy libs
- No dark patterns

### 12) DELIVERABLES

Agent must output:
1. Full codebase
2. README
3. SEO/GEO checklist
4. Extensibility notes

---

## Sohbet Geçmişi ve Geliştirme Süreci

### İlk Görüşme

**USER**: Oku anla.

**ASSISTANT**: Anladım.  

Sen bir LinkedIn postuyla ücretsiz kişisel web sitesi teklifi yapmışsın, 20 kişi yorum yapmış ve bu kişiler için sıraya alma süreci başlatmak istiyorsun. Bu süreç şu şekilde işleyecek:

- Önce bir "sıra duyurusu" LinkedIn postu yapılacak.  
- Katılımcılar, çekilişe katılmak için bu post serisine katılacak.  
- Sıralamayı belirlemek için adil bir kura/çekiliş sistemi kullanılacak (örneğin rastgele seçim yapan bir web aracı).  
- Her katılımcıya özel bir form (20 soruluk: Evet/Hayır, çoktan seçmeli, çoklu seçim, 1 uzun metin) doldurtulacak.  
- Formdan gelen yanıtlarla bir **özet (summary)** oluşturulacak:  
  - Hem AI'ın anlayabileceği şekilde,  
  - Hem de müşterinin okuyabileceği, kullanıcı dostu bir biçimde.  
- Bu özetle AI'ya kişisel web sitesi oluşturtturulacak.  
- Web sitesi **thisisyour.website** domainiyle yayınlanacak; hem İngilizce hem Türkçe dil desteği olacak.  
- Teknik altyapı: Vercel + GitHub entegrasyonu, şablon e-postalar ve domain kurulum rehberi sağlanacak.  
- Sıra listesi senin tarafında **düzenlenebilir** olacak; müşteriler baştan belli, sana link verilecek, onlar formu dolduracak.  
- Proje ilerledikçe kimin sitesi hazırlandıysa paylaşılacak ("Aha bu bitti, bu da bunun sitesi!").

Elindeki isim listesi de net: toplam 20 kişi var ve bu kişilerle sürecin başlatılması planlanıyor.

### İlk Geliştirme Adımları

**USER**: Önce basit websitesini oluşturalım. html+vercel+github+js+css .
BU kısımda müşteriden gelen özet vs database e yazılacak en ağrısız sızısız database istiyorum en basit.
Şimdi siteyi tasarla html+css+js+vanilla minimal ve premium olsun.

İlk basit HTML formu oluşturuldu.

**USER**: Kanka türkce ve ingilizce iki dil olacak. UPdate!

İki dilli versiyon eklendi.

**USER**: ROLE... [Detaylı spesifikasyon]

Tam sistem spesifikasyonu verildi ve implementasyon başlatıldı.

**USER**: ingilizceden vazgeçtim önce sadece türkçe gerekli düzenlemelir yap

Sadece Türkçe versiyona geçildi.

**USER**: bütün md ve txt leri tek dosya da topla düzenle

Bu dokümantasyon dosyası oluşturuldu.

---

## Değişiklik Geçmişi (Changelog)

### 2026-01-14

#### Proje Oluşturma ve İlk Kurulum
- ✅ Proje yapısı oluşturuldu (HTML, CSS, JS dosyaları)
- ✅ Landing page (index.html) - Türkçe dil desteği ile
- ✅ Başvuru formu sayfası (apply.html) - 20 soruluk form
- ✅ Admin paneli (admin.html) - Sıra yönetimi
- ✅ CSS dosyası (assets/styles.css) - Karanlık/Açık tema desteği
- ✅ JavaScript dosyaları (app.js, apply.js, admin.js)
- ✅ API endpoint'leri (Vercel Functions):
  - `/api/public.js` - Public showcase
  - `/api/apply-validate.js` - Token doğrulama
  - `/api/apply-submit.js` - Form gönderimi
  - `/api/admin-login.js` - Admin girişi
  - `/api/admin-logout.js` - Admin çıkışı
  - `/api/admin-queue.js` - Sıra listesi
  - `/api/admin-queue-create.js` - Yeni öğe oluştur
  - `/api/admin-queue-update.js` - Öğe güncelle
  - `/api/admin/submission.js` - Gönderim detayları
- ✅ Supabase veritabanı şeması (supabase-schema.sql)
- ✅ Package.json ve Vercel konfigürasyonu
- ✅ .gitignore dosyası

#### Dokümantasyon
- ✅ Tüm MD ve TXT dosyaları tek bir README.md dosyasında birleştirildi
- ✅ Proje spesifikasyonu, kurulum rehberi, agent spesifikasyonları ve sohbet geçmişi dokümante edildi
- ✅ Değişiklik geçmişi (Changelog) bölümü eklendi

#### Dil Desteği
- ✅ Sadece Türkçe dil desteği (İngilizce desteği kaldırıldı)

#### Özellikler
- ✅ 20 soruluk form sistemi (5 Evet/Hayır, 5 Tek seçim, 4 Çoklu seçim, 5 Kısa metin, 1 Uzun metin)
- ✅ Otomatik özet üretimi (müşteri özeti + AI JSON payload)
- ✅ Token tabanlı güvenli form erişimi
- ✅ Admin paneli ile sıra yönetimi
- ✅ Tamamlanan siteler showcase'i
- ✅ Karanlık/Açık tema toggle

#### Düzeltmeler
- ✅ Vercel deployment hatası düzeltildi: `vercel.json` dosyasındaki runtime formatı `@vercel/node` olarak güncellendi

#### Temizlik
- ✅ Proje temizliği yapıldı: Vercel config klasörü, build çıktıları ve gereksiz dosyalar temizlendi
- ✅ `.vercel`, `.next`, `dist`, `build`, `out` klasörleri silindi
- ✅ `node_modules`, lock dosyaları temizlendi (gerekirse `npm install` ile yeniden kurulabilir)
- ✅ `.gitignore` dosyası güncellendi: build klasörleri ve lock dosyaları eklendi

---

## Notlar

- Proje şu anda sadece Türkçe dil desteği ile çalışıyor
- İngilizce dil desteği gelecekte eklenebilir
- Tüm kodlar vanilla HTML/CSS/JS ile yazılmış
- Supabase Postgres veritabanı kullanılıyor
- Vercel Serverless Functions backend olarak kullanılıyor
- Tüm değişiklikler bu README.md dosyasına loglanacaktır

---

**Son Güncelleme**: 2026-01-14  
**Versiyon**: 1.0.0  
**Lisans**: © 2026 thisisyour.website
