# Turso Kurulum Rehberi

## 1. Turso CLI Kurulumu (Windows)

### Windows için - En Kolay Yöntem: Vercel Marketplace (Önerilen) ⭐

**Vercel Dashboard üzerinden direkt ekleyin:**
1. Vercel Dashboard → Project Settings → Integrations
2. "Turso" arayın ve "Add Integration" tıklayın
3. Yeni database oluşturun veya mevcut database'i bağlayın
4. Environment variables otomatik eklenir!

**Artık CLI'ya ihtiyaç yok!** Database URL ve token Vercel'de hazır olacak.

---

### Alternatif: CLI ile (Local Development için)

**Seçenek 1: WSL kullan (En kolay)**
```powershell
# WSL'i aç
wsl

# WSL içinde:
curl -sSfL https://get.tur.so/install.sh | bash

# PATH'e ekle (WSL'de)
export PATH="$HOME/.turso:$PATH"

# Kontrol et
turso --version
```

**Seçenek 2: Direct Binary Download**
```powershell
# PowerShell'de
# 1. Releases sayfasından Windows binary indirin:
# https://github.com/tursodatabase/turso-cli/releases
# 2. turso.exe'yi PATH'e ekleyin

# Veya direkt kullanın (örnek):
# .\turso.exe --version
```

**Not**: Local development için CLI gerekmez. Vercel Marketplace entegrasyonu yeterli!

## 2. Turso Hesabı Oluşturma ve Giriş

```bash
# Yeni hesap oluştur
turso auth signup

# Veya mevcut hesapla giriş yap
turso auth login
```

## 3. Database Oluşturma

```bash
# Yeni database oluştur
turso db create thisisyourwebsite

# Database URL'ini al (bunu saklayın!)
turso db show thisisyourwebsite

# Database için auth token oluştur (bunu da saklayın!)
turso db tokens create thisisyourwebsite
```

## 4. Local Development (Opsiyonel)

```bash
# Local SQLite dosyası oluştur
turso dev --db-file local.db

# Bu komut çalışırken local.db dosyası oluşur
# Connection string: file:local.db
```

## 5. Connection Bilgileri

Kurulum sonrası şunlara ihtiyacınız olacak:

1. **Database URL**: `libsql://xxxxx-xxxxx.turso.io`
2. **Auth Token**: `eyJ...` (uzun bir token)

Bu bilgileri Vercel environment variables'a ekleyeceğiz:
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

## 6. Schema Migration

Schema'yı Turso'ya migrate etmek için:

```bash
# SQL dosyasını çalıştır (Turso SQLite syntax'ına uyarlanmış olacak)
turso db shell thisisyourwebsite < turso-schema.sql
```

---

**Sonraki Adım**: Bu adımları tamamladıktan sonra bana database URL ve token'ı verin, kod tarafını uyarlayacağım.
