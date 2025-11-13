# Personel Yönetim Sistemi - Türkçe Dokümantasyon

## İçindekiler
1. [Proje Hakkında](#proje-hakkında)
2. [Gereksinimler](#gereksinimler)
3. [Kurulum Adımları](#kurulum-adımları)
4. [PostgreSQL Kurulumu ve Yapılandırması](#postgresql-kurulumu-ve-yapılandırması)
5. [Projeyi Çalıştırma](#projeyi-çalıştırma)
6. [LazyVim ile Geliştirme](#lazyvim-ile-geliştirme)
7. [Proje Yapısı ve Açıklamalar](#proje-yapısı-ve-açıklamalar)
8. [Yeni Özellik Ekleme Rehberi](#yeni-özellik-ekleme-rehberi)
9. [Gelecek Feature Önerileri](#gelecek-feature-önerileri)
10. [Sık Karşılaşılan Sorunlar](#sık-karşılaşılan-sorunlar)

---

## Proje Hakkında

Bu proje, şirketlerdeki personel yönetimini kolaylaştırmak için geliştirilmiş modern bir web uygulamasıdır.

### Ana Özellikler

- **👥 Personel Yönetimi**: Çalışanların bilgilerini kaydetme, güncelleme ve görüntüleme
- **🏖️ İzin Takibi**: Yıllık izin günlerini takip etme, kullanılan ve kalan günleri görme
- **📝 İzin Talepleri**: İzin talebi oluşturma, onaylama ve reddetme
- **📄 Evrak Yönetimi**: Personele ait belgeleri (sözleşme, kimlik, sertifika vb.) saklama
- **📊 Dashboard**: Genel istatistikler ve özet bilgiler

### Teknik Altyapı

**Backend (Sunucu Tarafı)**
- Java 17 ile yazılmış Spring Boot uygulaması
- PostgreSQL veritabanı ile veri saklama
- REST API ile frontend'e veri sağlama

**Frontend (İstemci Tarafı)**
- React 18 ile modern kullanıcı arayüzü
- TypeScript ile tip güvenliği
- Tailwind CSS ve shadcn/ui ile şık tasarım

---

## Gereksinimler

Projeyi çalıştırmak için bilgisayarınızda şunlar yüklü olmalı:

### Zorunlu Yazılımlar

1. **Java Development Kit (JDK) 17 veya üzeri**
   - İndirme: https://adoptium.net/
   - Kurulum sonrası terminal/cmd'de test: `java -version`

2. **Node.js 18 veya üzeri**
   - İndirme: https://nodejs.org/
   - Kurulum sonrası test: `node -v` ve `npm -v`

3. **PostgreSQL 14 veya üzeri**
   - İndirme: https://www.postgresql.org/download/
   - Kurulum sonrası test: `psql --version`

4. **Git**
   - İndirme: https://git-scm.com/
   - Kurulum sonrası test: `git --version`

### Opsiyonel (Geliştirme için önerilen)

1. **Neovim ve LazyVim**
   - Neovim indirme: https://neovim.io/
   - LazyVim kurulumu: https://www.lazyvim.org/

2. **Maven** (Spring Boot ile birlikte gelir, ayrıca yüklemeye gerek yok)

---

## Kurulum Adımları

### 1. Projeyi İndirin

```bash
# Projeyi klonlayın
git clone <proje-url>
cd staffy
```

### 2. PostgreSQL Veritabanını Hazırlayın

#### Windows'ta PostgreSQL Kurulumu

1. PostgreSQL installer'ı indirin ve çalıştırın
2. Kurulum sırasında:
   - Port: 5432 (varsayılan)
   - Superuser şifresi belirleyin (örn: postgres)
   - Locale: Turkish_Turkey.UTF-8 veya C

3. pgAdmin açın (PostgreSQL ile birlikte gelir)

#### macOS'ta PostgreSQL Kurulumu

```bash
# Homebrew ile kurulum
brew install postgresql@14
brew services start postgresql@14
```

#### Linux'ta PostgreSQL Kurulumu

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Servisi başlatın
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Veritabanı Oluşturun

```bash
# PostgreSQL'e bağlanın
psql -U postgres

# Veritabanı oluşturun
CREATE DATABASE staffdb;

# Kullanıcı oluşturun (opsiyonel)
CREATE USER staffuser WITH PASSWORD 'staffpass123';

# Yetkileri verin
GRANT ALL PRIVILEGES ON DATABASE staffdb TO staffuser;

# Çıkış
\q
```

### 4. Backend Yapılandırması

Backend klasöründeki `application.properties` dosyasını düzenleyin:

```bash
cd backend/src/main/resources
```

`application.properties` dosyasını açın ve düzenleyin:

```properties
# Server Configuration
server.port=8080
spring.application.name=staff-management

# PostgreSQL Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/staffdb
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

**Önemli Notlar:**
- `spring.datasource.username` ve `spring.datasource.password` kendi veritabanı bilgileriniz ile değiştirin
- `spring.jpa.hibernate.ddl-auto=create-drop` ilk çalıştırmada `create` olmalı, sonrasında `update` yapabilirsiniz

### 5. PostgreSQL Driver Ekleme

`backend/pom.xml` dosyasını açın ve PostgreSQL driver'ı ekleyin:

```xml
<!-- PostgreSQL Driver -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

H2 Database bağımlılığını kaldırın veya yoruma alın:

```xml
<!-- H2 Database - Artık kullanılmıyor
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
-->
```

---

## Projeyi Çalıştırma

### Backend (API) Başlatma

```bash
# Backend klasörüne gidin
cd backend

# Maven wrapper ile projeyi derleyin ve çalıştırın
./mvnw clean install
./mvnw spring-boot:run

# Windows için:
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

**Backend başarılı çalışıyorsa:**
- Terminal'de "Started StaffManagementApplication" mesajını göreceksiniz
- API: http://localhost:8080 adresinde çalışır
- Test için tarayıcıda: http://localhost:8080/api/staff

### Frontend (Web Arayüzü) Başlatma

Yeni bir terminal penceresi açın:

```bash
# Frontend klasörüne gidin
cd frontend

# Bağımlılıkları yükleyin (ilk sefer)
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

**Frontend başarılı çalışıyorsa:**
- Terminal'de "Local: http://localhost:5173" mesajını göreceksiniz
- Tarayıcınızda: http://localhost:5173 adresine gidin

---

## LazyVim ile Geliştirme

### LazyVim Nedir?

LazyVim, Neovim için hazır bir IDE yapılandırmasıdır. Kod yazmayı hızlandırır ve modern editör özelliklerini sağlar.

### LazyVim Kurulumu

1. **Neovim Yükleyin** (0.9.0 veya üzeri)

```bash
# macOS
brew install neovim

# Ubuntu/Debian
sudo apt install neovim

# Windows (Chocolatey)
choco install neovim
```

2. **LazyVim Yapılandırmasını Yükleyin**

```bash
# Mevcut Neovim yapılandırmanızı yedekleyin
mv ~/.config/nvim ~/.config/nvim.bak
mv ~/.local/share/nvim ~/.local/share/nvim.bak

# LazyVim'i klonlayın
git clone https://github.com/LazyVim/starter ~/.config/nvim

# Neovim'i açın (eklentiler otomatik yüklenecek)
nvim
```

### Proje için Önerilen LazyVim Eklentileri

`~/.config/nvim/lua/plugins/` klasörüne yeni dosyalar ekleyin:

#### Java Geliştirme için

`java.lua` dosyası oluşturun:

```lua
return {
  -- Java dil desteği
  {
    "mfussenegger/nvim-jdtls",
    ft = "java",
  },

  -- Maven desteği
  {
    "eatgrass/maven.nvim",
    ft = "java",
  },
}
```

#### TypeScript/React Geliştirme için

`typescript.lua` dosyası oluşturun:

```lua
return {
  -- TypeScript dil sunucusu
  {
    "pmizio/typescript-tools.nvim",
    dependencies = { "nvim-lua/plenary.nvim", "neovim/nvim-lspconfig" },
    opts = {},
  },

  -- Tailwind CSS desteği
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        tailwindcss = {},
      },
    },
  },
}
```

### LazyVim ile Kod Yazma Temel Komutlar

#### Navigasyon

- `<Space>` + `e` : Dosya gezginini aç/kapat
- `<Space>` + `f` + `f` : Dosya ara
- `<Space>` + `f` + `g` : Dosya içinde metin ara
- `<Ctrl>` + `o` : Önceki konuma git
- `<Ctrl>` + `i` : Sonraki konuma git

#### Düzenleme

- `<Space>` + `c` + `f` : Kodu formatla
- `g` + `d` : Tanıma git (definition)
- `g` + `r` : Referansları bul
- `K` : Hover bilgisi göster
- `<Space>` + `r` + `n` : Yeniden adlandır (rename)

#### Terminal

- `<Space>` + `t` : Terminal aç
- `<Ctrl>` + `\` : Terminal kapat/aç

#### Git

- `<Space>` + `g` + `g` : LazyGit aç
- `<Space>` + `g` + `b` : Git blame göster

### Proje İçinde Gezinme

```bash
# Projeyi LazyVim ile açın
cd staffy
nvim .

# Dosya gezgininde:
# j/k = yukarı/aşağı git
# Enter = dosya/klasör aç
# a = yeni dosya
# d = sil
# r = yeniden adlandır
```

### Backend Geliştirme Akışı (LazyVim)

1. **Yeni Entity Oluşturma:**

```bash
# LazyVim'de dosya gezginini açın
:e backend/src/main/java/com/staffmanagement/model/YeniEntity.java
```

2. **Kod Tamamlama:**
   - Yazmaya başlayın, otomatik öneriler gelecek
   - `Tab` ile öneriyi kabul edin
   - `Ctrl+Space` ile manuel öneri listesi

3. **Hata Kontrolü:**
   - Kırmızı altı çizili yerler hata
   - Sarı altı çizili yerler uyarı
   - `<Space>` + `x` + `x` için hata listesi

### Frontend Geliştirme Akışı (LazyVim)

1. **Yeni Component Oluşturma:**

```bash
# LazyVim'de
:e frontend/src/components/YeniComponent.tsx
```

2. **Import Otomatik Ekleme:**
   - Bir component/fonksiyon yazın
   - `<Space>` + `c` + `a` kod eylemleri menüsü
   - "Add missing imports" seçin

3. **Tailwind Class Önerileri:**
   - `className=""` içinde otomatik öneri gelir

---

## Proje Yapısı ve Açıklamalar

### Backend (Spring Boot) Yapısı

```
backend/
├── pom.xml                              # Maven bağımlılıkları
└── src/main/
    ├── java/com/staffmanagement/
    │   ├── StaffManagementApplication.java  # Ana başlangıç dosyası
    │   ├── config/                          # Yapılandırma sınıfları
    │   │   ├── CorsConfig.java              # CORS ayarları
    │   │   └── DataInitializer.java         # Başlangıç verileri
    │   ├── controller/                      # REST API endpoint'leri
    │   │   ├── StaffController.java         # /api/staff endpointleri
    │   │   ├── LeaveRequestController.java  # /api/leave-requests
    │   │   └── DocumentController.java      # /api/documents
    │   ├── model/                           # Veritabanı tabloları
    │   │   ├── Staff.java                   # Personel tablosu
    │   │   ├── LeaveRequest.java            # İzin talepleri tablosu
    │   │   ├── Document.java                # Evrak tablosu
    │   │   └── ...enums                     # Enum tipleri
    │   ├── repository/                      # Veritabanı erişim katmanı
    │   │   ├── StaffRepository.java
    │   │   ├── LeaveRequestRepository.java
    │   │   └── DocumentRepository.java
    │   └── service/                         # İş mantığı katmanı
    │       ├── StaffService.java
    │       ├── LeaveRequestService.java
    │       └── DocumentService.java
    └── resources/
        └── application.properties           # Uygulama ayarları
```

#### Katmanlar ve Görevleri

1. **Model (Entity) Katmanı**: Veritabanı tablolarını temsil eder
   - `@Entity` annotation'ı ile işaretlenir
   - Her sınıf bir tablo, her field bir kolon
   - İlişkiler (`@OneToMany`, `@ManyToOne`) burada tanımlanır

2. **Repository Katmanı**: Veritabanı işlemleri
   - `JpaRepository` extend eder
   - CRUD işlemleri otomatik sağlanır
   - Özel sorgular yazılabilir

3. **Service Katmanı**: İş mantığı
   - Repository'leri kullanır
   - Karmaşık işlemler burada yapılır
   - Transaction yönetimi burada

4. **Controller Katmanı**: HTTP isteklerini karşılar
   - REST API endpoint'lerini tanımlar
   - `@GetMapping`, `@PostMapping` vb.
   - Service'leri çağırır

### Frontend (React) Yapısı

```
frontend/
├── package.json                    # NPM bağımlılıkları
├── tailwind.config.js             # Tailwind CSS ayarları
├── vite.config.ts                 # Vite yapılandırması
└── src/
    ├── main.tsx                   # Uygulama başlangıcı
    ├── App.tsx                    # Ana route tanımları
    ├── index.css                  # Global stiller
    ├── components/                # Yeniden kullanılabilir bileşenler
    │   ├── Layout.tsx             # Ana sayfa düzeni ve navigasyon
    │   └── ui/                    # shadcn/ui bileşenleri
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── input.tsx
    │       └── ...
    ├── pages/                     # Sayfa bileşenleri
    │   ├── Dashboard.tsx          # Ana sayfa
    │   ├── StaffList.tsx          # Personel listesi
    │   ├── StaffDetail.tsx        # Personel detay sayfası
    │   ├── LeaveRequests.tsx      # İzin talepleri listesi
    │   └── LeaveRequestForm.tsx   # Yeni izin talebi formu
    ├── services/                  # API çağrıları
    │   └── api.ts                 # Backend ile iletişim
    ├── types/                     # TypeScript tip tanımları
    │   └── index.ts               # Interface ve enum'lar
    └── lib/                       # Yardımcı fonksiyonlar
        └── utils.ts               # Genel utility fonksiyonları
```

#### React Component Yapısı

Örnek bir component:

```typescript
// pages/Dashboard.tsx
import { useEffect, useState } from 'react';  // React hook'ları
import { Card } from '@/components/ui/card';   // UI bileşeni
import { staffApi } from '@/services/api';     // API servisi
import { Staff } from '@/types';               // Tip tanımları

export default function Dashboard() {
  // State (durum) yönetimi
  const [staff, setStaff] = useState<Staff[]>([]);

  // Component yüklendiğinde çalışır
  useEffect(() => {
    loadData();
  }, []);

  // API'den veri çekme
  const loadData = async () => {
    const data = await staffApi.getAll();
    setStaff(data);
  };

  // JSX ile UI render etme
  return (
    <div>
      <h1>Dashboard</h1>
      {/* ... */}
    </div>
  );
}
```

---

## Yeni Özellik Ekleme Rehberi

### Örnek: Departman Yönetimi Ekleme

#### 1. Backend'de Yeni Entity Oluşturma

`backend/src/main/java/com/staffmanagement/model/Department.java`:

```java
package com.staffmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "departments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String managerName;

    @OneToMany(mappedBy = "department")
    private List<Staff> staffList;
}
```

#### 2. Repository Oluşturma

`backend/src/main/java/com/staffmanagement/repository/DepartmentRepository.java`:

```java
package com.staffmanagement.repository;

import com.staffmanagement.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByName(String name);
}
```

#### 3. Service Oluşturma

`backend/src/main/java/com/staffmanagement/service/DepartmentService.java`:

```java
package com.staffmanagement.service;

import com.staffmanagement.model.Department;
import com.staffmanagement.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository repository;

    public List<Department> getAll() {
        return repository.findAll();
    }

    public Department create(Department department) {
        return repository.save(department);
    }
}
```

#### 4. Controller Oluşturma

`backend/src/main/java/com/staffmanagement/controller/DepartmentController.java`:

```java
package com.staffmanagement.controller;

import com.staffmanagement.model.Department;
import com.staffmanagement.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {
    private final DepartmentService service;

    @GetMapping
    public ResponseEntity<List<Department>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<Department> create(@RequestBody Department dept) {
        return ResponseEntity.ok(service.create(dept));
    }
}
```

#### 5. Frontend'de Type Tanımlama

`frontend/src/types/index.ts`:

```typescript
export interface Department {
  id?: number;
  name: string;
  description: string;
  managerName: string;
}
```

#### 6. API Service Ekleme

`frontend/src/services/api.ts`:

```typescript
export const departmentApi = {
  getAll: async (): Promise<Department[]> => {
    const response = await fetch(`${API_BASE_URL}/departments`);
    return response.json();
  },

  create: async (dept: Department): Promise<Department> => {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dept),
    });
    return response.json();
  },
};
```

#### 7. Sayfa Oluşturma

`frontend/src/pages/DepartmentList.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { departmentApi } from '@/services/api';
import { Department } from '@/types';

export default function DepartmentList() {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const data = await departmentApi.getAll();
    setDepartments(data);
  };

  return (
    <div>
      <h1>Departmanlar</h1>
      {departments.map(dept => (
        <div key={dept.id}>
          <h3>{dept.name}</h3>
          <p>{dept.description}</p>
        </div>
      ))}
    </div>
  );
}
```

#### 8. Route Ekleme

`frontend/src/App.tsx`:

```typescript
<Route path="departments" element={<DepartmentList />} />
```

---

## Gelecek Feature Önerileri

### 1. Kullanıcı Kimlik Doğrulama (Authentication) 🔐

**Neden Önemli:** Sistemde her kullanıcının kendi hesabı olmalı

**Özellikler:**
- Kullanıcı girişi (login) ve kayıt
- JWT token tabanlı kimlik doğrulama
- Rol bazlı yetkilendirme (Admin, Yönetici, Çalışan)
- Şifre sıfırlama

**Teknolojiler:**
- Spring Security (Backend)
- JWT (Json Web Token)
- React Context veya Redux (Frontend)

**Zorluk:** ⭐⭐⭐⭐ (Orta-İleri seviye)

### 2. E-posta Bildirimleri 📧

**Neden Önemli:** Kullanıcılar önemli olaylardan haberdar olmalı

**Özellikler:**
- İzin talebi onaylandığında/reddedildiğinde e-posta gönder
- Yeni personel eklendiğinde yöneticiye bildirim
- Hatırlatma e-postaları (örn: yaklaşan izin)

**Teknolojiler:**
- Spring Mail
- Gmail SMTP veya SendGrid

**Zorluk:** ⭐⭐⭐ (Orta seviye)

### 3. Dosya Yükleme Sistemi 📁

**Neden Önemli:** Evraklar fiziksel olarak yüklenebilmeli

**Özellikler:**
- PDF, Word, resim dosyalarını yükleme
- Dosyaları bulut depolama veya sunucuda saklama
- Dosya önizleme
- Dosya indirme

**Teknolojiler:**
- Spring MultipartFile
- AWS S3 veya lokal depolama
- React Dropzone

**Zorluk:** ⭐⭐⭐ (Orta seviye)

### 4. Gelişmiş Dashboard ve Raporlar 📊

**Neden Önemli:** Yöneticilerin karar verme süreçlerini destekler

**Özellikler:**
- Departman bazlı izin istatistikleri
- Aylık/yıllık izin trendleri
- Grafik ve chartlar
- PDF rapor oluşturma
- Excel export

**Teknolojiler:**
- Chart.js veya Recharts
- Apache POI (Excel)
- iText PDF

**Zorluk:** ⭐⭐⭐ (Orta seviye)

### 5. Mesai Takibi ⏰

**Neden Önemli:** Çalışanların mesai saatlerini takip etme

**Özellikler:**
- Giriş/çıkış saati kaydetme
- Haftalık/aylık toplam mesai hesaplama
- Fazla mesai takibi
- Geç kalma raporları

**Teknolojiler:**
- Java LocalDateTime
- Quartz Scheduler (otomatik işlemler için)

**Zorluk:** ⭐⭐⭐⭐ (Orta-İleri seviye)

### 6. Maaş Bordro Sistemi 💰

**Neden Önemli:** Personel maaşlarını yönetme

**Özellikler:**
- Maaş bilgisi kaydetme
- Aylık bordro oluşturma
- Kesintiler ve primler
- Maaş geçmişi

**Teknolojiler:**
- Yeni Entity'ler (Salary, Payroll)
- PDF oluşturma

**Zorluk:** ⭐⭐⭐⭐ (Orta-İleri seviye)

### 7. Performans Değerlendirme 📝

**Neden Önemli:** Çalışan performansını takip etme

**Özellikler:**
- Periyodik değerlendirme formları
- Hedef belirleme ve takibi
- Yönetici geri bildirimleri
- Performans raporları

**Teknolojiler:**
- Yeni Entity'ler (Performance, Goal, Feedback)
- Form validasyonları

**Zorluk:** ⭐⭐⭐⭐ (Orta-İleri seviye)

### 8. Mobil Uygulama 📱

**Neden Önemli:** Kullanıcılar mobilde de erişebilmeli

**Özellikler:**
- React Native ile mobil uygulama
- Push notification
- QR kod ile giriş/çıkış
- Offline çalışma

**Teknolojiler:**
- React Native
- Expo

**Zorluk:** ⭐⭐⭐⭐⭐ (İleri seviye)

### 9. Çoklu Dil Desteği 🌍

**Neden Önemli:** Farklı dillerde kullanılabilmeli

**Özellikler:**
- Türkçe, İngilizce, Almanca vb.
- Dil değiştirme butonu
- Tarih formatları

**Teknolojiler:**
- i18next (React)
- Spring MessageSource

**Zorluk:** ⭐⭐⭐ (Orta seviye)

### 10. Takvim Entegrasyonu 📅

**Neden Önemli:** İzin günlerini takvimde gösterme

**Özellikler:**
- Google Calendar entegrasyonu
- iCal export
- Tatil günleri işaretleme
- Departman bazlı takvim görünümü

**Teknolojiler:**
- FullCalendar.js
- Google Calendar API

**Zorluk:** ⭐⭐⭐⭐ (Orta-İleri seviye)

---

## Sık Karşılaşılan Sorunlar

### Problem 1: Backend Başlamıyor

**Hata:** `Unable to connect to database`

**Çözüm:**
1. PostgreSQL servisinin çalıştığından emin olun:
```bash
# Windows
services.msc açın ve PostgreSQL servisini kontrol edin

# macOS/Linux
sudo systemctl status postgresql
```

2. `application.properties` dosyasındaki veritabanı bilgilerini kontrol edin
3. Veritabanının oluşturulduğundan emin olun

### Problem 2: Frontend API'ye Erişemiyor

**Hata:** `Failed to fetch` veya `CORS error`

**Çözüm:**
1. Backend'in çalıştığından emin olun (http://localhost:8080/api/staff)
2. `CorsConfig.java` dosyasını kontrol edin
3. Frontend'in doğru API URL'sini kullandığını kontrol edin (`api.ts`)

### Problem 3: Maven Build Hatası

**Hata:** `Could not resolve dependencies`

**Çözüm:**
```bash
# Maven cache'i temizleyin
./mvnw clean

# Dependencies'i yeniden yükleyin
./mvnw install -U
```

### Problem 4: NPM Install Hatası

**Hata:** `EACCES: permission denied`

**Çözüm:**
```bash
# npm cache'i temizleyin
npm cache clean --force

# node_modules'u silin ve yeniden yükleyin
rm -rf node_modules
npm install
```

### Problem 5: Port Zaten Kullanılıyor

**Hata:** `Port 8080 is already in use`

**Çözüm:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <pid_numarası> /F

# macOS/Linux
lsof -i :8080
kill -9 <pid_numarası>
```

---

## Yardımcı Komutlar

### Git Komutları

```bash
# Değişiklikleri göster
git status

# Değişiklikleri ekle
git add .

# Commit oluştur
git commit -m "Açıklayıcı mesaj"

# Uzak sunucuya gönder
git push

# Güncellemeleri çek
git pull
```

### Maven Komutları

```bash
# Projeyi derle
./mvnw compile

# Testleri çalıştır
./mvnw test

# JAR dosyası oluştur
./mvnw package

# Dependency güncellemelerini kontrol et
./mvnw versions:display-dependency-updates
```

### NPM Komutları

```bash
# Bağımlılık ekle
npm install <paket-adı>

# Development bağımlılık ekle
npm install -D <paket-adı>

# Production build
npm run build

# Linting
npm run lint
```

---

## Yardımcı Kaynaklar

### Öğrenme Kaynakları

**Spring Boot:**
- Resmi Dokümantasyon: https://spring.io/guides
- Baeldung Tutorials: https://www.baeldung.com/spring-boot
- Spring Boot Tutorial (Türkçe): YouTube'da arama yapın

**React:**
- Resmi Dokümantasyon: https://react.dev/
- React Tutorial (Türkçe): https://tr.reactjs.org/
- Scrimba Interactive Course: https://scrimba.com/learn/learnreact

**PostgreSQL:**
- Resmi Dokümantasyon: https://www.postgresql.org/docs/
- PostgreSQL Tutorial: https://www.postgresqltutorial.com/

**LazyVim:**
- Resmi Site: https://www.lazyvim.org/
- YouTube Tutorials: "LazyVim Tutorial" arayın

### Topluluklar

- Stack Overflow: https://stackoverflow.com/
- Reddit r/SpringBoot: https://www.reddit.com/r/SpringBoot/
- Reddit r/reactjs: https://www.reddit.com/r/reactjs/
- Discord: "The Primeagen" Discord sunucusu (Neovim için)

---

## Lisans

Bu proje MIT lisansı altında açık kaynaklıdır.

---

**İyi Çalışmalar! 🚀**

Sorularınız için GitHub Issues kullanabilir veya dokümantasyona katkıda bulunabilirsiniz.
