import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { staffApi, attendanceApi } from '@/services/api';
import type { Staff, AttendanceRecord } from '@/types';
import { AttendanceStatus } from '@/types';
import { Clock, LogIn, LogOut, Coffee, Play, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/animated/LoadingSpinner';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function AttendanceClock() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadStaff();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedStaffId) {
      loadTodayAttendance();
    }
  }, [selectedStaffId]);

  const loadStaff = async () => {
    try {
      const data = await staffApi.getAll();
      setStaff(data.filter((s: Staff) => s.active));
      if (data.length > 0) {
        setSelectedStaffId(data[0].id!.toString());
      }
    } catch (error) {
      console.error('Failed to load staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTodayAttendance = async () => {
    if (!selectedStaffId) return;

    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const records = await attendanceApi.getByDate(parseInt(selectedStaffId), today);
      setTodayAttendance(records.length > 0 ? records[0] : null);
    } catch (error) {
      console.error('Failed to load attendance:', error);
      setTodayAttendance(null);
    }
  };

  const handleClockIn = async () => {
    if (!selectedStaffId) return;

    setActionLoading(true);
    try {
      const location = 'Office'; // Could be enhanced with geolocation
      const record = await attendanceApi.clockIn(parseInt(selectedStaffId), location);
      setTodayAttendance(record);
    } catch (error) {
      console.error('Failed to clock in:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!selectedStaffId) return;

    setActionLoading(true);
    try {
      const location = 'Office';
      const record = await attendanceApi.clockOut(parseInt(selectedStaffId), location);
      setTodayAttendance(record);
    } catch (error) {
      console.error('Failed to clock out:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBreakStart = async () => {
    if (!selectedStaffId) return;

    setActionLoading(true);
    try {
      const record = await attendanceApi.breakStart(parseInt(selectedStaffId));
      setTodayAttendance(record);
    } catch (error) {
      console.error('Failed to start break:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBreakEnd = async () => {
    if (!selectedStaffId) return;

    setActionLoading(true);
    try {
      const record = await attendanceApi.breakEnd(parseInt(selectedStaffId));
      setTodayAttendance(record);
    } catch (error) {
      console.error('Failed to end break:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '--:--';
    return format(new Date(timeString), 'HH:mm');
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const selectedStaff = staff.find(s => s.id?.toString() === selectedStaffId);
  const isOnBreak = todayAttendance?.status === AttendanceStatus.ON_BREAK;
  const isClockedIn = !!(todayAttendance && !todayAttendance.clockOutTime);
  const isClockedOut = !!(todayAttendance && todayAttendance.clockOutTime);

  if (loading) {
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
        Attendance Clock
      </motion.h1>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Current Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <motion.div
                  className="text-5xl font-bold tabular-nums"
                  key={currentTime.getSeconds()}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {format(currentTime, 'HH:mm:ss')}
                </motion.div>
                <p className="text-muted-foreground">
                  {format(currentTime, 'EEEE, MMMM dd, yyyy')}
                </p>

                <div className="pt-4">
                  <label className="text-sm font-medium mb-2 block">Select Staff</label>
                  <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((member) => (
                        <SelectItem key={member.id} value={member.id!.toString()}>
                          {member.firstName} {member.lastName} - {member.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Clock Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full h-16 text-lg"
                size="lg"
                onClick={handleClockIn}
                disabled={!selectedStaffId || isClockedIn || actionLoading}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Clock In
              </Button>

              <Button
                className="w-full h-16 text-lg"
                size="lg"
                variant="secondary"
                onClick={handleBreakStart}
                disabled={!isClockedIn || isOnBreak || isClockedOut || actionLoading}
              >
                <Coffee className="h-5 w-5 mr-2" />
                Start Break
              </Button>

              <Button
                className="w-full h-16 text-lg"
                size="lg"
                variant="secondary"
                onClick={handleBreakEnd}
                disabled={!isOnBreak || actionLoading}
              >
                <Play className="h-5 w-5 mr-2" />
                End Break
              </Button>

              <Button
                className="w-full h-16 text-lg"
                size="lg"
                variant="destructive"
                onClick={handleClockOut}
                disabled={!isClockedIn || isOnBreak || isClockedOut || actionLoading}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Clock Out
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {selectedStaff && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                Today's Summary - {selectedStaff.firstName} {selectedStaff.lastName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayAttendance ? (
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p className="text-lg font-semibold">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          todayAttendance.status === AttendanceStatus.PRESENT
                            ? 'bg-green-100 text-green-800'
                            : todayAttendance.status === AttendanceStatus.ON_BREAK
                            ? 'bg-yellow-100 text-yellow-800'
                            : todayAttendance.status === AttendanceStatus.LATE
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {todayAttendance.status}
                      </span>
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Clock In</p>
                    <p className="text-lg font-semibold">{formatTime(todayAttendance.clockInTime)}</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Clock Out</p>
                    <p className="text-lg font-semibold">{formatTime(todayAttendance.clockOutTime)}</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Work</p>
                    <p className="text-lg font-semibold">
                      {formatDuration(todayAttendance.totalWorkMinutes)}
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Break Duration</p>
                    <p className="text-lg font-semibold">
                      {formatDuration(todayAttendance.breakDurationMinutes)}
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Overtime</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatDuration(todayAttendance.overtimeMinutes)}
                    </p>
                  </div>

                  {todayAttendance.location && (
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="text-lg font-semibold">{todayAttendance.location}</p>
                    </div>
                  )}

                  <div className="p-4 border rounded-lg">
                    <Link to={`/attendance/reports?staff=${selectedStaffId}`}>
                      <Button variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        View Reports
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No attendance record for today. Clock in to start tracking.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
