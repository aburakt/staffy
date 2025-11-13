# 🚀 Hızlı Çözüm Rehberi

## Karşılaştığınız Sorunlar İçin Hızlı Çözümler

---

## 1️⃣ PostgreSQL Sorunu Çözümü (macOS)

### En Kolay Yöntem: Docker Kullanın 🐳

```bash
# PostgreSQL'i Docker ile çalıştırın (tek komut!)
docker run --name staffy-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=staffdb \
  -p 5432:5432 \
  -d postgres:14
```

✅ **Bu komuttan sonra:**
- PostgreSQL otomatik çalışacak
- Kullanıcı: `postgres`
- Şifre: `postgres`
- Veritabanı: `staffdb`
- Port: `5432`

### Veya: Mevcut PostgreSQL'i Kullanın

```bash
# 1. PostgreSQL servisini başlatın
brew services start postgresql@14

# 2. Kendi kullanıcınızla bağlanın
psql

# 3. Veritabanı ve postgres kullanıcısı oluşturun
CREATE USER postgres WITH PASSWORD 'postgres' SUPERUSER;
CREATE DATABASE staffdb;
GRANT ALL PRIVILEGES ON DATABASE staffdb TO postgres;
\q
```

**Backend ayarları zaten doğru (`application.properties`):**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/staffdb
spring.datasource.username=postgres
spring.datasource.password=postgres
```

---

## 2️⃣ Maven (mvnw) Sorunu Çözümü ✅

**Artık düzeltildi!** `mvnw` dosyaları eklendi.

```bash
cd backend

# İzin vermek için (macOS/Linux)
chmod +x mvnw

# Test edin
./mvnw --version

# Projeyi çalıştırın
./mvnw spring-boot:run
```

**Eğer hala sorun varsa:**

```bash
# Maven direkt kullanın
cd backend
mvn spring-boot:run
```

---

## 3️⃣ Tailwind CSS Sorunu Çözümü ✅

**Artık düzeltildi!** `@tailwindcss/postcss` kuruldu.

```bash
cd frontend

# Eğer hala hata varsa, node_modules'u temizleyin
rm -rf node_modules package-lock.json
npm install

# Başlatın
npm run dev
```

---

## 📝 Şimdi Yapmanız Gerekenler (Sırayla)

### Adım 1: PostgreSQL'i Başlatın

**Seçenek A: Docker (Önerilen - Kolay)**
```bash
docker run --name staffy-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=staffdb \
  -p 5432:5432 \
  -d postgres:14

# Çalıştığını kontrol edin
docker ps
```

**Seçenek B: Homebrew PostgreSQL**
```bash
brew services start postgresql@14
psql
CREATE USER postgres WITH PASSWORD 'postgres' SUPERUSER;
CREATE DATABASE staffdb;
\q
```

### Adım 2: Backend'i Başlatın

```bash
cd backend

# İzin verin (ilk sefer)
chmod +x mvnw

# Çalıştırın
./mvnw spring-boot:run
```

**Beklenen çıktı:**
```
Started StaffManagementApplication in X.XXX seconds
```

**Test:**
```bash
curl http://localhost:8080/api/staff
```

### Adım 3: Frontend'i Başlatın

Yeni terminal açın:

```bash
cd frontend
npm run dev
```

**Beklenen çıktı:**
```
Local: http://localhost:5173/
```

**Tarayıcı:** http://localhost:5173

✅ Dashboard görebiliyorsanız BAŞARILI!

---

## 🔄 Sonraki Çalıştırmalarda

### PostgreSQL (Docker)

```bash
# Başlat
docker start staffy-db

# Durdur
docker stop staffy-db

# Durumu kontrol
docker ps
```

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm run dev
```

---

## ❌ Hala Sorun mu Var?

### Backend başlamıyor

```bash
# Port 8080 kontrolü
lsof -i :8080

# Varsa sonlandır
kill -9 <PID>

# Farklı port dene
./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

### Frontend başlamıyor

```bash
# Temizle
rm -rf node_modules
npm install

# Yeniden başlat
npm run dev
```

### PostgreSQL bağlanamıyor

```bash
# Docker container durumu
docker ps -a

# Log'ları kontrol
docker logs staffy-db

# Yeniden başlat
docker restart staffy-db
```

---

## 📚 Detaylı Dokümantasyon

- **SORUN_GIDERME.md** - Tüm sorunlar ve detaylı çözümler
- **POSTGRESQL_MACOS.md** - PostgreSQL macOS kurulum rehberi
- **GELISTIRME_REHBERI.md** - Kapsamlı geliştirme rehberi

---

## 💡 İpuçları

1. **Her zaman bu sırayı takip edin:**
   - PostgreSQL → Backend → Frontend

2. **Docker en kolayı:**
   - Kurulum yok
   - Temiz environment
   - Kolay yönetim

3. **Port çakışması:**
   - Backend: 8080
   - Frontend: 5173
   - PostgreSQL: 5432

4. **Logs önemli:**
   - Backend: Terminal output
   - Frontend: Terminal + Browser Console (F12)

---

**İyi çalışmalar! 🎉**

Sorun devam ederse SORUN_GIDERME.md dosyasına bakın veya GitHub Issues açın.
