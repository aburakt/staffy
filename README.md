# Staff Management System / Personel Yönetim Sistemi

A comprehensive staff management application built with Spring Boot and React, featuring leave tracking, contact management, and document storage.

> **🇹🇷 Türkçe Dokümantasyon:** [KURULUM_ADIMLAR.md](KURULUM_ADIMLAR.md) | [GELISTIRME_REHBERI.md](GELISTIRME_REHBERI.md)

## Features

- **Staff Management**: Add, update, view, and manage staff members
- **Leave Tracking**: Track annual leave days, used days, and remaining balance
- **Leave Requests**: Submit, approve, and reject leave requests
- **Document Management**: Store and manage staff documents (contracts, ID cards, certificates, etc.)
- **Dashboard**: Overview of staff statistics and recent leave requests
- **Contact Information**: Store and display staff contact details

## Tech Stack

### Backend
- **Spring Boot 3.2.0** - Java framework
- **Spring Data JPA** - Database access
- **PostgreSQL** - Production database (H2 also supported for development)
- **Lombok** - Reduces boilerplate code
- **Maven** - Dependency management

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

### Quick Setup

**For detailed Turkish documentation, see [KURULUM_ADIMLAR.md](KURULUM_ADIMLAR.md)**

1. **Setup PostgreSQL Database:**
```bash
psql -U postgres
CREATE DATABASE staffdb;
\q
```

2. **Configure Backend:**

Copy `application.properties.example` to `application.properties` and update database credentials:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. **Run Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Endpoints

### Staff Endpoints
- `GET /api/staff` - Get all staff
- `GET /api/staff/{id}` - Get staff by ID
- `GET /api/staff/active` - Get active staff only
- `GET /api/staff/department/{department}` - Get staff by department
- `POST /api/staff` - Create new staff
- `PUT /api/staff/{id}` - Update staff
- `DELETE /api/staff/{id}` - Delete staff
- `PUT /api/staff/{id}/deactivate` - Deactivate staff

### Leave Request Endpoints
- `GET /api/leave-requests` - Get all leave requests
- `GET /api/leave-requests/{id}` - Get leave request by ID
- `GET /api/leave-requests/staff/{staffId}` - Get leave requests by staff
- `GET /api/leave-requests/status/{status}` - Get leave requests by status
- `POST /api/leave-requests/staff/{staffId}` - Create leave request
- `PUT /api/leave-requests/{id}/approve` - Approve leave request
- `PUT /api/leave-requests/{id}/reject` - Reject leave request
- `DELETE /api/leave-requests/{id}` - Delete leave request

### Document Endpoints
- `GET /api/documents` - Get all documents
- `GET /api/documents/{id}` - Get document by ID
- `GET /api/documents/staff/{staffId}` - Get documents by staff
- `POST /api/documents/staff/{staffId}` - Create document
- `PUT /api/documents/{id}` - Update document
- `DELETE /api/documents/{id}` - Delete document

## Project Structure

### Backend Structure
```
backend/
├── src/main/java/com/staffmanagement/
│   ├── config/          # Configuration classes
│   ├── controller/      # REST controllers
│   ├── model/           # Entity classes
│   ├── repository/      # JPA repositories
│   ├── service/         # Business logic
│   └── StaffManagementApplication.java
└── src/main/resources/
    └── application.properties
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── ui/         # shadcn/ui components
│   │   └── Layout.tsx  # Main layout
│   ├── pages/          # Page components
│   │   ├── Dashboard.tsx
│   │   ├── StaffList.tsx
│   │   ├── StaffDetail.tsx
│   │   ├── LeaveRequests.tsx
│   │   └── LeaveRequestForm.tsx
│   ├── services/       # API services
│   ├── types/          # TypeScript types
│   └── lib/            # Utilities
└── ...
```

## Sample Data

The application comes with pre-populated sample data including:
- 3 sample staff members
- 2 sample leave requests
- 2 sample documents

This data is automatically created on application startup via `DataInitializer.java`

## Development

### Adding New Features

1. **Backend**:
   - Add entity in `model/`
   - Create repository in `repository/`
   - Implement service in `service/`
   - Create controller in `controller/`

2. **Frontend**:
   - Add TypeScript types in `types/`
   - Create API service in `services/`
   - Build page/component in `pages/` or `components/`
   - Add route in `App.tsx`

### Database Configuration

The project is configured to use PostgreSQL by default. To switch back to H2 for development:

1. Uncomment H2 dependency in `pom.xml`
2. Comment out PostgreSQL dependency
3. Update `application.properties` with H2 configuration

For detailed setup and development guide in Turkish, see [GELISTIRME_REHBERI.md](GELISTIRME_REHBERI.md)

## Documentation

### 📖 Turkish Documentation

- **[HIZLI_COZUM.md](HIZLI_COZUM.md)** - Quick troubleshooting guide (START HERE!)
- **[KURULUM_ADIMLAR.md](KURULUM_ADIMLAR.md)** - Step-by-step setup guide
- **[GELISTIRME_REHBERI.md](GELISTIRME_REHBERI.md)** - Comprehensive development guide
  - PostgreSQL setup
  - LazyVim development workflow
  - Project structure explanations
  - Feature implementation guide
  - 10 future feature suggestions

### 🔧 Troubleshooting

- **[SORUN_GIDERME.md](SORUN_GIDERME.md)** - Common issues and solutions
- **[POSTGRESQL_MACOS.md](POSTGRESQL_MACOS.md)** - PostgreSQL setup on macOS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.