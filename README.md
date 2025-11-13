# Staff Management System / Personel Yönetim Sistemi

A comprehensive staff management application built with Spring Boot and React, featuring leave tracking, contact management, and document storage.

> **🇹🇷 Türkçe Dokümantasyon:** [KURULUM_ADIMLAR.md](KURULUM_ADIMLAR.md) | [GELISTIRME_REHBERI.md](GELISTIRME_REHBERI.md)

## Features

- **Staff Management**: Add, update, view, and manage staff members
  - Table and card view toggle with smooth animations
  - Comprehensive staff details with documents and leave history
- **Leave Tracking**: Track annual leave days, used days, and remaining balance
- **Leave Requests**: Submit, approve, and reject leave requests
  - Download professional leave certificates (Word .docx format)
  - Turkish-formatted official leave certificates
- **Attendance Tracking** ⭐ NEW
  - Clock in/out system with automatic overtime calculation
  - Break time tracking
  - Monthly attendance reports with charts
  - GPS location and IP address logging
  - Late detection and status tracking
- **Document Management**: Store and manage staff documents (contracts, ID cards, certificates, etc.)
- **Enhanced Dashboard**: Comprehensive statistics and insights
  - Real-time staff on leave tracking with return dates
  - Document completion status overview
  - Quick certificate generation from dashboard
  - Animated statistics cards with trends
- **Modern UI**: Beautiful animations powered by Framer Motion
  - Staggered entrance animations
  - Smooth transitions between views
  - Interactive hover effects
  - Loading states with custom spinners

## Tech Stack

### Backend
- **Spring Boot 3.2.0** - Java framework
- **Spring Data JPA** - Database access with automatic calculations
- **PostgreSQL** - Production database (H2 also supported for development)
- **Apache POI 5.2.5** - Word document generation (.docx)
- **Lombok** - Reduces boilerplate code
- **Maven** - Dependency management

### Frontend
- **React 19.2.0** - Latest React version with new features
- **React Compiler 1.0.0** - Automatic memoization and optimization
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.2** - Build tool and dev server
- **Framer Motion 12.23.24** - Animation library
- **Recharts 3.4.1** - Chart library for reports
- **date-fns 4.1.0** - Date manipulation
- **React Router 7.9.5** - Navigation
- **Tailwind CSS 4.1.17** - Styling
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
- `GET /api/leave-requests/{id}/certificate` - Download leave certificate (Word .docx)
- `DELETE /api/leave-requests/{id}` - Delete leave request

### Document Endpoints
- `GET /api/documents` - Get all documents
- `GET /api/documents/{id}` - Get document by ID
- `GET /api/documents/staff/{staffId}` - Get documents by staff
- `POST /api/documents/staff/{staffId}` - Create document
- `PUT /api/documents/{id}` - Update document
- `DELETE /api/documents/{id}` - Delete document

### Attendance Endpoints ⭐ NEW
- `POST /api/attendance/staff/{staffId}/clock-in` - Clock in for work
- `PUT /api/attendance/staff/{staffId}/clock-out` - Clock out from work
- `PUT /api/attendance/staff/{staffId}/break-start` - Start break
- `PUT /api/attendance/staff/{staffId}/break-end` - End break
- `GET /api/attendance/staff/{staffId}` - Get attendance records
- `GET /api/attendance/staff/{staffId}/date/{date}` - Get attendance by date
- `GET /api/attendance/staff/{staffId}/monthly-report` - Get monthly report

### Dashboard Endpoints ⭐ NEW
- `GET /api/dashboard/stats` - Get comprehensive dashboard statistics
- `GET /api/dashboard/document-completion` - Get document completion details

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
│   │   ├── animated/   # Animated components with Framer Motion
│   │   │   ├── StatsCard.tsx       # Animated statistics card
│   │   │   ├── StaffCard.tsx       # Staff card with animations
│   │   │   ├── ViewToggle.tsx      # Table/Card view switcher
│   │   │   └── LoadingSpinner.tsx  # Animated loading spinner
│   │   └── Layout.tsx  # Main layout
│   ├── pages/          # Page components
│   │   ├── Dashboard.tsx          # Enhanced dashboard with stats
│   │   ├── StaffList.tsx          # Staff list with view toggle
│   │   ├── StaffDetail.tsx
│   │   ├── LeaveRequests.tsx      # With certificate download
│   │   ├── LeaveRequestForm.tsx
│   │   ├── AttendanceClock.tsx    # Clock in/out interface
│   │   └── AttendanceReports.tsx  # Monthly reports with charts
│   ├── services/       # API services
│   │   └── api.ts     # staffApi, leaveRequestApi, attendanceApi,
│   │                  # dashboardApi, certificateApi
│   ├── types/          # TypeScript types
│   │   └── index.ts   # Staff, LeaveRequest, AttendanceRecord,
│   │                  # DashboardStats, etc.
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