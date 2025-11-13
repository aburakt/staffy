import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { staffApi, leaveRequestApi } from '@/services/api';
import { Staff, LeaveRequest, LeaveStatus } from '@/types';
import { Users, Calendar, Clock, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStaff: 0,
    activeStaff: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
  });
  const [recentLeaves, setRecentLeaves] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [staff, leaves] = await Promise.all([
        staffApi.getAll(),
        leaveRequestApi.getAll(),
      ]);

      setStats({
        totalStaff: staff.length,
        activeStaff: staff.filter((s: Staff) => s.active).length,
        pendingLeaves: leaves.filter((l: LeaveRequest) => l.status === LeaveStatus.PENDING).length,
        approvedLeaves: leaves.filter((l: LeaveRequest) => l.status === LeaveStatus.APPROVED).length,
      });

      setRecentLeaves(leaves.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStaff}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStaff}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingLeaves}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedLeaves}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLeaves.map((leave) => (
              <div key={leave.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium">
                    {leave.staff?.firstName} {leave.staff?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {leave.startDate} to {leave.endDate} ({leave.daysRequested} days)
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    leave.status === LeaveStatus.APPROVED
                      ? 'bg-green-100 text-green-800'
                      : leave.status === LeaveStatus.PENDING
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {leave.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
