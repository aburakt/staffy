import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { staffApi, attendanceApi } from '@/services/api';
import type { Staff, AttendanceRecord } from '@/types';
import { AttendanceStatus } from '@/types';
import { Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/animated/LoadingSpinner';
import { StatsCard } from '@/components/animated/StatsCard';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AttendanceReports() {
  const [searchParams] = useSearchParams();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>(searchParams.get('staff') || '');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    if (selectedStaffId) {
      loadAttendanceData();
    }
  }, [selectedStaffId, year, month]);

  const loadStaff = async () => {
    try {
      const data = await staffApi.getAll();
      setStaff(data.filter((s: Staff) => s.active));
      if (!selectedStaffId && data.length > 0) {
        setSelectedStaffId(data[0].id!.toString());
      }
    } catch (error) {
      console.error('Failed to load staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceData = async () => {
    if (!selectedStaffId) return;

    setLoading(true);
    try {
      const data = await attendanceApi.getMonthlyReport(parseInt(selectedStaffId), year, month);
      setRecords(data);
    } catch (error) {
      console.error('Failed to load attendance data:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalDays = records.length;
    const presentDays = records.filter(r => r.status === AttendanceStatus.PRESENT).length;
    const lateDays = records.filter(r => r.status === AttendanceStatus.LATE).length;
    const totalWorkMinutes = records.reduce((sum, r) => sum + (r.totalWorkMinutes || 0), 0);
    const totalOvertimeMinutes = records.reduce((sum, r) => sum + (r.overtimeMinutes || 0), 0);

    return {
      totalDays,
      presentDays,
      lateDays,
      totalWorkHours: Math.round(totalWorkMinutes / 60),
      totalOvertimeHours: Math.round(totalOvertimeMinutes / 60),
    };
  };

  const prepareChartData = () => {
    return records.slice(0, 15).map(record => ({
      date: format(new Date(record.date), 'MMM dd'),
      hours: parseFloat(((record.totalWorkMinutes || 0) / 60).toFixed(1)),
      overtime: parseFloat(((record.overtimeMinutes || 0) / 60).toFixed(1)),
    }));
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '--:--';
    return format(new Date(timeString), 'HH:mm');
  };

  const selectedStaff = staff.find(s => s.id?.toString() === selectedStaffId);
  const stats = calculateStats();
  const chartData = prepareChartData();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  if (loading && !selectedStaffId) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <motion.h1
        className="text-3xl font-bold"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Attendance Reports
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Filter Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Staff Member</label>
                <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map((member) => (
                      <SelectItem key={member.id} value={member.id!.toString()}>
                        {member.firstName} {member.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Year</label>
                <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Month</label>
                <Select value={month.toString()} onValueChange={(v) => setMonth(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m} value={m.toString()}>
                        {format(new Date(2024, m - 1, 1), 'MMMM')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {selectedStaff && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatsCard
              title="Total Days"
              value={stats.totalDays}
              icon={Calendar}
              description="Days with records"
              delay={0.2}
            />

            <StatsCard
              title="Present Days"
              value={stats.presentDays}
              icon={Calendar}
              description="On-time attendance"
              delay={0.25}
            />

            <StatsCard
              title="Late Days"
              value={stats.lateDays}
              icon={AlertCircle}
              description="Late arrivals"
              delay={0.3}
            />

            <StatsCard
              title="Total Hours"
              value={stats.totalWorkHours}
              icon={Clock}
              description="Work hours this month"
              delay={0.35}
            />

            <StatsCard
              title="Overtime"
              value={stats.totalOvertimeHours}
              icon={TrendingUp}
              description="Extra hours worked"
              delay={0.4}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Work Hours Chart (Last 15 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="hours" fill="#8884d8" name="Regular Hours" />
                      <Bar dataKey="overtime" fill="#82ca9d" name="Overtime" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No attendance data for this period</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Detailed Records</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : records.length > 0 ? (
                  <div className="space-y-2">
                    {records.map((record, index) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 + index * 0.02 }}
                        className="grid grid-cols-6 gap-4 p-3 border rounded-lg items-center"
                      >
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium">{format(new Date(record.date), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Clock In</p>
                          <p className="font-medium">{formatTime(record.clockInTime)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Clock Out</p>
                          <p className="font-medium">{formatTime(record.clockOutTime)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Work Time</p>
                          <p className="font-medium">{formatDuration(record.totalWorkMinutes)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Overtime</p>
                          <p className="font-medium text-blue-600">{formatDuration(record.overtimeMinutes)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                              record.status === AttendanceStatus.PRESENT
                                ? 'bg-green-100 text-green-800'
                                : record.status === AttendanceStatus.LATE
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {record.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No attendance records found for this period</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}
