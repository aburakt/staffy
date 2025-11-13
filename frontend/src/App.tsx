import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StaffList from './pages/StaffList';
import StaffDetail from './pages/StaffDetail';
import LeaveRequests from './pages/LeaveRequests';
import LeaveRequestForm from './pages/LeaveRequestForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="staff" element={<StaffList />} />
          <Route path="staff/:id" element={<StaffDetail />} />
          <Route path="leaves" element={<LeaveRequests />} />
          <Route path="leaves/new" element={<LeaveRequestForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
