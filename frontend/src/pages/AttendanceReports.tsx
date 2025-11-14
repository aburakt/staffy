import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { exportApi } from '@/services/api';
import type { AttendanceRecord } from '@/types';
import { AttendanceStatus } from '@/types';
import { Calendar, Clock, TrendingUp, AlertCircle, FileDown, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AttendanceReportsSkeleton } from '@/components/skeletons/AttendanceReportsSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { StatsCard } from '@/components/animated/StatsCard';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStaff } from '@/hooks/useStaff';
import { useMonthlyReport } from '@/hooks/useAttendance';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n/useTranslation';

export default function AttendanceReports() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [selectedStaffId, setSelectedStaffId] = useState<string>(searchParams.get('staff') || '');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [exportingData, setExportingData] = useState(false);

  const { data: allStaff = [], isLoading: staffLoading, error: staffError, refetch: refetchStaff } = useStaff();
  const activeStaff = allStaff.filter(s => s.active);

  const staffId = selectedStaffId ? parseInt(selectedStaffId) : 0;
  const { data: records = [], isLoading: recordsLoading, error: recordsError } = useMonthlyReport(staffId, year, month);

  useEffect(() => {
    if (activeStaff.length > 0 && !selectedStaffId) {
      setSelectedStaffId(activeStaff[0].id!.toString());
    }
  }, [activeStaff, selectedStaffId]);

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
      date: format(new Date(record.date), 'dd MMM', { locale: tr }),
      hours: parseFloat(((record.totalWorkMinutes || 0) / 60).toFixed(1)),
      overtime: parseFloat(((record.overtimeMinutes || 0) / 60).toFixed(1)),
    }));
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '0s 0d';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}s ${mins}d`;
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '--:--';
    return format(new Date(timeString), 'HH:mm');
  };

  const handleExport = async () => {
    if (!selectedStaffId) {
      toast.warning(t.attendance.reports.selectStaffWarning);
      return;
    }

    if (exportingData) return; // Prevent spam clicks

    try {
      setExportingData(true);
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];
      const blob = await exportApi.exportAttendance(parseInt(selectedStaffId), startDate, endDate);
      exportApi.downloadBlob(blob, `yoklama_${selectedStaffId}_${year}_${month}.csv`);
      toast.success(t.attendance.reports.exportSuccess);
    } catch (error) {
      console.error('Failed to export attendance:', error);
      toast.error(t.attendance.reports.exportError);
    } finally {
      setExportingData(false);
    }
  };

  const selectedStaff = activeStaff.find(s => s.id?.toString() === selectedStaffId);
  const stats = calculateStats();
  const chartData = prepareChartData();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  if (staffLoading) {
    return <AttendanceReportsSkeleton />;
  }

  if (staffError) {
    return <ErrorState error={staffError} onRetry={() => refetchStaff()} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.h1
          className="text-3xl font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t.attendance.reports.title}
        </motion.h1>
        <Button variant="outline" onClick={handleExport} disabled={!selectedStaffId || exportingData}>
          {exportingData ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="mr-2 h-4 w-4" />
          )}
          {t.common.exportCsv}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t.attendance.reports.filterOptions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium mb-2 block">{t.attendance.reports.staffMember}</label>
                <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.attendance.reports.staffMember} />
                  </SelectTrigger>
                  <SelectContent>
                    {activeStaff.map((member) => (
                      <SelectItem key={member.id} value={member.id!.toString()}>
                        {member.firstName} {member.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t.attendance.reports.year}</label>
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
                <label className="text-sm font-medium mb-2 block">{t.attendance.reports.month}</label>
                <Select value={month.toString()} onValueChange={(v) => setMonth(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m} value={m.toString()}>
                        {format(new Date(2024, m - 1, 1), 'MMMM', { locale: tr })}
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
              title={t.attendance.reports.totalDays}
              value={stats.totalDays}
              icon={Calendar}
              description={t.attendance.reports.daysWithRecords}
              delay={0.2}
            />

            <StatsCard
              title={t.attendance.reports.presentDays}
              value={stats.presentDays}
              icon={Calendar}
              description={t.attendance.reports.onTimeAttendance}
              delay={0.25}
            />

            <StatsCard
              title={t.attendance.reports.lateDays}
              value={stats.lateDays}
              icon={AlertCircle}
              description={t.attendance.reports.lateArrivals}
              delay={0.3}
            />

            <StatsCard
              title={t.attendance.reports.totalHours}
              value={stats.totalWorkHours}
              icon={Clock}
              description={t.attendance.reports.workHoursThisMonth}
              delay={0.35}
            />

            <StatsCard
              title={t.attendance.clock.overtime}
              value={stats.totalOvertimeHours}
              icon={TrendingUp}
              description={t.attendance.reports.extraHoursWorked}
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
                <CardTitle>{t.attendance.reports.workHoursChart} ({t.attendance.reports.lastDays})</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: 'Saat', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="hours" fill="#8884d8" name="Normal Saat" />
                      <Bar dataKey="overtime" fill="#82ca9d" name="Mesai" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>{t.attendance.reports.noData}</p>
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
                <CardTitle>{t.attendance.reports.detailedRecords}</CardTitle>
              </CardHeader>
              <CardContent>
                {recordsLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
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
                          <p className="text-sm text-muted-foreground">{t.attendance.reports.date}</p>
                          <p className="font-medium">{format(new Date(record.date), 'dd MMM yyyy', { locale: tr })}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t.attendance.clock.clockInTime}</p>
                          <p className="font-medium">{formatTime(record.clockInTime)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t.attendance.clock.clockOutTime}</p>
                          <p className="font-medium">{formatTime(record.clockOutTime)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t.attendance.reports.workTime}</p>
                          <p className="font-medium">{formatDuration(record.totalWorkMinutes)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t.attendance.clock.overtime}</p>
                          <p className="font-medium text-blue-600">{formatDuration(record.overtimeMinutes)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Durum</p>
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                              record.status === AttendanceStatus.PRESENT
                                ? 'bg-green-100 text-green-800'
                                : record.status === AttendanceStatus.LATE
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {record.status === AttendanceStatus.PRESENT ? t.attendance.status.present :
                             record.status === AttendanceStatus.LATE ? t.attendance.status.late :
                             record.status === AttendanceStatus.ON_BREAK ? t.attendance.status.onBreak :
                             record.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>{t.attendance.reports.noData}</p>
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
