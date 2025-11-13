# Sık Karşılaşılan Sorunlar ve Çözümleri

## 🐘 PostgreSQL Sorunları (macOS)

### Sorun 1: "role postgres does not exist"

**Sebep:** macOS'ta PostgreSQL varsayılan olarak sistem kullanıcı adınızla kurulur.

**Çözüm 1: Kendi kullanıcı adınızı kullanın**

```bash
# Kullanıcı adınızı öğrenin
whoami

# PostgreSQL'e bağlanın (şifre gerekmez)
psql

# Veritabanı oluşturun
CREATE DATABASE staffdb;
\q
```

Sonra `backend/src/main/resources/application.properties` dosyasında:

```properties
spring.datasource.username=SIZIN_KULLANICI_ADINIZ
spring.datasource.password=
```

**Çözüm 2: postgres kullanıcısı oluşturun**

```bash
# PostgreSQL'e bağlanın
psql

# postgres kullanıcısı oluşturun
CREATE USER postgres WITH PASSWORD 'postgres' SUPERUSER;
CREATE DATABASE staffdb;
GRANT ALL PRIVILEGES ON DATABASE staffdb TO postgres;
\q
```

### Sorun 2: PostgreSQL servisi çalışmıyor

```bash
# Homebrew ile kurulu mu kontrol edin
brew services list

# Servisi başlatın
brew services start postgresql@14

# Veya
brew services start postgresql

# Port kontrolü
lsof -i :5432
```

### Sorun 3: Docker ile PostgreSQL (Kolay Yol)

```bash
# PostgreSQL container başlat
docker run --name staffy-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=staffdb \
  -p 5432:5432 \
  -d postgres:14

# Çalıştığını kontrol et
docker ps

# Durdur
docker stop staffy-postgres

# Tekrar başlat
docker start staffy-postgres

# Sil
docker rm staffy-postgres
```

---

## ☕ Backend (Maven) Sorunları

### Sorun 1: "./mvnw: no such file or directory"

**Sebep:** Maven wrapper dosyaları eksik.

**Çözüm:** Artık mvnw dosyaları projede mevcut. Eğer hala sorun varsa:

```bash
cd backend

# Executable izni verin
chmod +x mvnw

# Test edin
./mvnw --version
```

### Sorun 2: Maven bağımlılıkları indirilemiyor

**Çözüm 1: Maven cache temizle**

```bash
cd backend
./mvnw clean
rm -rf ~/.m2/repository
./mvnw install
```

**Çözüm 2: Maven yerine direkt Java ile çalıştırın**

```bash
cd backend
# Önce derleyin
mvn clean package -DskipTests

# JAR'ı çalıştırın
java -jar target/staff-management-1.0.0.jar
```

### Sorun 3: Port 8080 kullanımda

```bash
# macOS/Linux
lsof -i :8080
kill -9 <PID>

# Veya farklı port kullanın
./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

---

## ⚛️ Frontend (React) Sorunları

### Sorun 1: Tailwind CSS PostCSS hatası

**Hata:**
```
[postcss] It looks like you're trying to use tailwindcss directly as a PostCSS plugin
```

**Çözüm:** Zaten düzeltildi! Ama eğer sorun devam ederse:

```bash
cd frontend

# @tailwindcss/postcss yükleyin
npm install -D @tailwindcss/postcss

# node_modules ve cache temizle
rm -rf node_modules package-lock.json
npm install

# Yeniden başlat
npm run dev
```

### Sorun 2: Port 5173 kullanımda

```bash
# macOS/Linux
lsof -i :5173
kill -9 <PID>

# Veya Vite farklı port kullanacak şekilde başlatın
npm run dev -- --port 3000
```

### Sorun 3: API bağlantı hatası (CORS)

**Semptomlar:**
- Browser console'da CORS hatası
- "Failed to fetch" hatası
- Network request'ler başarısız

**Çözüm:**

1. Backend'in çalıştığını kontrol edin:
```bash
curl http://localhost:8080/api/staff
```

2. CORS ayarları doğru mu kontrol edin (`CorsConfig.java`):
```java
.allowedOrigins("http://localhost:5173")
```

3. Backend'i yeniden başlatın

### Sorun 4: "Module not found" hataları

```bash
cd frontend

# Bağımlılıkları yeniden yükle
rm -rf node_modules
npm install

# Path alias sorunları için tsconfig kontrol
cat tsconfig.app.json
```

---

## 🔄 Genel Sorunlar

### Proje tamamen temiz baştan başlatma

```bash
# Backend temizle
cd backend
./mvnw clean
rm -rf target/

# Frontend temizle
cd ../frontend
rm -rf node_modules dist .vite
npm install

# PostgreSQL veritabanını sıfırla
psql
DROP DATABASE IF EXISTS staffdb;
CREATE DATABASE staffdb;
\q
```

### Veritabanı şeması sıfırlamak

`application.properties` dosyasında:

```properties
# Tüm tabloları sil ve yeniden oluştur
spring.jpa.hibernate.ddl-auto=create-drop

# Veya sadece güncelle
spring.jpa.hibernate.ddl-auto=update
```

---

## 📞 Yardım Alma

Sorun devam ediyorsa:

1. **Log dosyalarını kontrol edin:**
   - Backend: Console output
   - Frontend: Browser console (F12)

2. **Detaylı hata mesajını alın:**
```bash
# Backend için
./mvnw spring-boot:run -X

# Frontend için
npm run dev -- --debug
```

3. **Sürümleri kontrol edin:**
```bash
java -version    # 17+
node -v          # 18+
npm -v           # 9+
psql --version   # 14+
```

4. **GitHub Issues:** Detaylı hata mesajıyla issue açın

---

## 🚀 Hızlı Test

Her şeyin çalıştığını test etmek için:

```bash
# Terminal 1: PostgreSQL (Docker)
docker run --name staffy-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=staffdb -p 5432:5432 -d postgres:14

# Terminal 2: Backend
cd backend
./mvnw spring-boot:run

# Terminal 3: Frontend
cd frontend
npm run dev

# Terminal 4: Test
curl http://localhost:8080/api/staff
```

Tarayıcıda: http://localhost:5173

✅ Dashboard görüyorsanız her şey çalışıyor!
