# Hızlı Kurulum Rehberi - Personel Yönetim Sistemi

Bu dosya, projeyi sıfırdan kurmak için gereken adımları içerir.

## 📋 Önkoşullar

Aşağıdaki yazılımların yüklü olduğundan emin olun:

- ✅ Java 17 veya üzeri
- ✅ Node.js 18 veya üzeri
- ✅ PostgreSQL 14 veya üzeri
- ✅ Git

### Kurulum Kontrolü

Terminal veya komut satırında şunları çalıştırın:

```bash
java -version    # Java 17+ görmeli
node -v          # v18+ görmeli
npm -v           # 9+ görmeli
psql --version   # PostgreSQL 14+ görmeli
git --version    # Herhangi bir versiyon
```

---

## 🗄️ Adım 1: PostgreSQL Veritabanı Kurulumu

### PostgreSQL'i Başlatın

**macOS:**
```bash
brew services start postgresql@14
```

**Linux:**
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**
- Başlat menüsünden "Services" açın
- PostgreSQL servisini bulun ve başlatın

### Veritabanı Oluşturun

```bash
# PostgreSQL'e bağlanın (şifre: postgres)
psql -U postgres

# Aşağıdaki komutları sırayla çalıştırın:
CREATE DATABASE staffdb;
CREATE USER staffuser WITH PASSWORD 'staffpass123';
GRANT ALL PRIVILEGES ON DATABASE staffdb TO staffuser;

# PostgreSQL'den çıkın
\q
```

**Not:** Yukarıdaki kullanıcı adı ve şifre örnek olarak verilmiştir. Kendi değerlerinizi kullanabilirsiniz.

---

## 🔧 Adım 2: Backend Yapılandırması

### Veritabanı Bağlantı Ayarları

1. Backend klasörüne gidin:
```bash
cd backend/src/main/resources
```

2. `application.properties` dosyasını açın ve kendi veritabanı bilgilerinizi girin:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/staffdb
spring.datasource.username=postgres
spring.datasource.password=postgres
```

**Dikkat:** Eğer farklı bir kullanıcı/şifre oluşturduysanız, bunları yukarıdaki dosyada değiştirin.

---

## 🚀 Adım 3: Projeyi Çalıştırın

### Backend'i Başlatın

Proje kök dizininden:

```bash
cd backend

# Bağımlılıkları yükleyin ve projeyi çalıştırın
./mvnw clean install
./mvnw spring-boot:run
```

**Windows için:**
```bash
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

✅ **Başarılı:** Terminal'de şu mesajı görmelisiniz:
```
Started StaffManagementApplication in X.XXX seconds
```

🌐 **Test:** Tarayıcıda http://localhost:8080/api/staff adresini açın

### Frontend'i Başlatın

Yeni bir terminal penceresi açın:

```bash
cd frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

✅ **Başarılı:** Terminal'de şu mesajı görmelisiniz:
```
Local: http://localhost:5173/
```

🌐 **Tarayıcı:** http://localhost:5173 adresine gidin

---

## 🎉 Başarıyla Kuruldu!

Artık uygulamayı kullanmaya başlayabilirsiniz. İlk açılışta örnek veriler otomatik olarak yüklenecektir:

- 3 Personel
- 2 İzin Talebi
- 2 Evrak

### İlk Giriş Ekranı

Ana sayfada şunları göreceksiniz:
- Dashboard ile genel istatistikler
- Navigasyon menüsü (Staff, Leave Requests)
- Örnek personel listesi

---

## 🔄 Sonraki Çalıştırmalarda

Veritabanı yapısı değişmediği sürece, `application.properties` dosyasında şu ayarı değiştirin:

```properties
spring.jpa.hibernate.ddl-auto=update
```

Bu sayede her seferinde veritabanı sıfırdan oluşturulmaz, sadece güncellenir.

---

## ❓ Sorun mu Yaşıyorsunuz?

### Backend başlamıyor

1. PostgreSQL servisinin çalıştığından emin olun
2. Veritabanının oluşturulduğunu kontrol edin
3. `application.properties` dosyasındaki kullanıcı adı/şifreyi kontrol edin

### Frontend API'ye bağlanamıyor

1. Backend'in http://localhost:8080 adresinde çalıştığını kontrol edin
2. Tarayıcıda http://localhost:8080/api/staff adresini test edin
3. CORS hatası alıyorsanız, backend'i yeniden başlatın

### Port zaten kullanılıyor hatası

```bash
# Port 8080'i kullanan işlemi bulun
# Linux/macOS:
lsof -i :8080

# Windows:
netstat -ano | findstr :8080

# İşlemi sonlandırın (PID numarasını yukarıdaki komuttan alın)
# Linux/macOS:
kill -9 <PID>

# Windows:
taskkill /PID <PID> /F
```

---

## 📚 Daha Fazla Bilgi

Detaylı dokümantasyon için bakınız:
- `GELISTIRME_REHBERI.md` - Kapsamlı geliştirme rehberi
- `README.md` - Proje genel bakış

---

**Başarılar! 🎊**
