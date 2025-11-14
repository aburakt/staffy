import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StaffList from './pages/StaffList';
import StaffDetail from './pages/StaffDetail';
import LeaveRequests from './pages/LeaveRequests';
import LeaveRequestForm from './pages/LeaveRequestForm';
import AttendanceClock from './pages/AttendanceClock';
import AttendanceReports from './pages/AttendanceReports';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="staff" element={<StaffList />} />
              <Route path="staff/:id" element={<StaffDetail />} />
              <Route path="leaves" element={<LeaveRequests />} />
              <Route path="leaves/new" element={<LeaveRequestForm />} />
              <Route path="attendance" element={<AttendanceClock />} />
              <Route path="attendance/reports" element={<AttendanceReports />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
