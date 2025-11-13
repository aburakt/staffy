# macOS'ta PostgreSQL Kurulum ve Sorun Giderme

## PostgreSQL Kurulum Kontrolleri

### 1. PostgreSQL Kurulu mu Kontrol Et

```bash
# Homebrew ile kurulu mu?
brew list | grep postgresql

# Hangi versiyonlar var?
brew info postgresql
```

### 2. PostgreSQL Servisi Başlatma

```bash
# PostgreSQL 14 için
brew services start postgresql@14

# Veya genel PostgreSQL için
brew services start postgresql

# Servis durumunu kontrol et
brew services list
```

### 3. Veritabanı Kullanıcısı Belirleme

macOS'ta PostgreSQL genellikle sisteminizin kullanıcı adıyla kurulur:

```bash
# Kullanıcı adınızı öğrenin
whoami

# O kullanıcı adıyla bağlanmayı deneyin
psql -U $(whoami) -l

# Veya sadece
psql -l
```

### 4. Veritabanı Oluşturma (Doğru Kullanıcı ile)

```bash
# Kendi kullanıcınızla bağlanın
psql

# PostgreSQL prompt'unda:
CREATE DATABASE staffdb;

# Yeni kullanıcı oluşturmak isterseniz:
CREATE USER postgres WITH PASSWORD 'postgres' SUPERUSER;

# Çıkış
\q
```

## Backend application.properties Ayarları

Eğer `postgres` kullanıcısı yoksa, kendi kullanıcı adınızı kullanın:

```properties
# PostgreSQL Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/staffdb
spring.datasource.username=aburakt
spring.datasource.password=
spring.datasource.driver-class-name=org.postgresql.Driver
```

**Not:** macOS'ta PostgreSQL genellikle trust authentication kullanır, yani şifre gerekli olmayabilir.

## Alternatif: Docker ile PostgreSQL

Eğer sorunlar devam ederse, Docker kullanabilirsiniz:

```bash
# PostgreSQL container başlat
docker run --name postgres-staffy \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=staffdb \
  -p 5432:5432 \
  -d postgres:14

# Durumu kontrol et
docker ps

# Container'a bağlan
docker exec -it postgres-staffy psql -U postgres
```
