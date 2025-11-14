import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AttendanceRecord } from '@/types';
import { AttendanceStatus } from '@/types';
import { Clock, LogIn, LogOut, Coffee, Play, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/animated/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useStaff } from '@/hooks/useStaff';
import { useTodayAttendance, useClockIn, useClockOut, useStartBreak, useEndBreak } from '@/hooks/useAttendance';
import { toast } from 'sonner';

export default function AttendanceClock() {
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: allStaff = [], isLoading: staffLoading, error: staffError, refetch: refetchStaff } = useStaff();
  const activeStaff = allStaff.filter(s => s.active);

  const staffId = selectedStaffId ? parseInt(selectedStaffId) : 0;
  const { data: todayAttendance, isLoading: attendanceLoading, error: attendanceError } = useTodayAttendance(staffId);

  const clockInMutation = useClockIn();
  const clockOutMutation = useClockOut();
  const startBreakMutation = useStartBreak();
  const endBreakMutation = useEndBreak();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeStaff.length > 0 && !selectedStaffId) {
      setSelectedStaffId(activeStaff[0].id!.toString());
    }
  }, [activeStaff, selectedStaffId]);

  const handleClockIn = async () => {
    if (!staffId) return;

    try {
      const location = 'Office'; // Could be enhanced with geolocation
      await clockInMutation.mutateAsync({ staffId, location });
      toast.success('Clocked in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to clock in');
    }
  };

  const handleClockOut = async () => {
    if (!staffId) return;

    try {
      const location = 'Office';
      await clockOutMutation.mutateAsync({ staffId, location });
      toast.success('Clocked out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to clock out');
    }
  };

  const handleBreakStart = async () => {
    if (!staffId) return;

    try {
      await startBreakMutation.mutateAsync(staffId);
      toast.success('Break started');
    } catch (error: any) {
      toast.error(error.message || 'Failed to start break');
    }
  };

  const handleBreakEnd = async () => {
    if (!staffId) return;

    try {
      await endBreakMutation.mutateAsync(staffId);
      toast.success('Break ended');
    } catch (error: any) {
      toast.error(error.message || 'Failed to end break');
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

  const selectedStaff = activeStaff.find(s => s.id?.toString() === selectedStaffId);
  const isOnBreak = todayAttendance?.status === AttendanceStatus.ON_BREAK;
  const isClockedIn = !!(todayAttendance && !todayAttendance.clockOutTime);
  const isClockedOut = !!(todayAttendance && todayAttendance.clockOutTime);
  const isActionLoading = clockInMutation.isPending || clockOutMutation.isPending ||
                          startBreakMutation.isPending || endBreakMutation.isPending;

  if (staffLoading) {
    return <LoadingSpinner />;
  }

  if (staffError) {
    return <ErrorState error={staffError} onRetry={() => refetchStaff()} />;
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
                      {activeStaff.map((member) => (
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
                disabled={!selectedStaffId || isClockedIn || isActionLoading}
              >
                {clockInMutation.isPending ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <LogIn className="h-5 w-5 mr-2" />
                )}
                Clock In
              </Button>

              <Button
                className="w-full h-16 text-lg"
                size="lg"
                variant="secondary"
                onClick={handleBreakStart}
                disabled={!isClockedIn || isOnBreak || isClockedOut || isActionLoading}
              >
                {startBreakMutation.isPending ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Coffee className="h-5 w-5 mr-2" />
                )}
                Start Break
              </Button>

              <Button
                className="w-full h-16 text-lg"
                size="lg"
                variant="secondary"
                onClick={handleBreakEnd}
                disabled={!isOnBreak || isActionLoading}
              >
                {endBreakMutation.isPending ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Play className="h-5 w-5 mr-2" />
                )}
                End Break
              </Button>

              <Button
                className="w-full h-16 text-lg"
                size="lg"
                variant="destructive"
                onClick={handleClockOut}
                disabled={!isClockedIn || isOnBreak || isClockedOut || isActionLoading}
              >
                {clockOutMutation.isPending ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <LogOut className="h-5 w-5 mr-2" />
                )}
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
