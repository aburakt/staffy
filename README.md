# Staff Management System

A comprehensive staff management application built with Spring Boot and React, featuring leave tracking, contact management, and document storage.

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
- **H2 Database** - In-memory database (can be replaced with PostgreSQL/MySQL)
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
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build and run the Spring Boot application:
```bash
./mvnw spring-boot:run
```

Or if you're on Windows:
```bash
mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8080`

3. Access H2 Console (optional):
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:staffdb`
- Username: `sa`
- Password: (leave empty)

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

To switch from H2 to PostgreSQL/MySQL, update `application.properties`:

```properties
# PostgreSQL example
spring.datasource.url=jdbc:postgresql://localhost:5432/staffdb
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

## License

This project is open source and available under the MIT License.