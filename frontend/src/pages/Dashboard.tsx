import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboardApi, certificateApi } from '@/services/api';
import type { DashboardStats } from '@/types';
import { Users, Calendar, Clock, CheckCircle, FileText, AlertCircle, Download } from 'lucide-react';
import { StatsCard } from '@/components/animated/StatsCard';
import { LoadingSpinner } from '@/components/animated/LoadingSpinner';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async (leaveRequestId: number) => {
    try {
      setDownloadingId(leaveRequestId);
      const blob = await certificateApi.downloadLeaveCertificate(leaveRequestId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `izin-belgesi-${leaveRequestId}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download certificate:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  const totalDocumentsRequired = Object.values(stats.documentCompletionStats).reduce((a, b) => a + b, 0);
  const missingDocuments = stats.documentCompletionStats.MISSING || 0;

  return (
    <div className="space-y-6">
      <motion.h1
        className="text-3xl font-bold"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Staff"
          value={stats.totalStaff}
          icon={Users}
          description="Total employees in system"
          delay={0}
        />

        <StatsCard
          title="Active Staff"
          value={stats.activeStaff}
          icon={CheckCircle}
          description="Currently active employees"
          delay={0.1}
        />

        <StatsCard
          title="On Leave"
          value={stats.onLeaveStaff}
          icon={Calendar}
          description="Staff currently on leave"
          delay={0.2}
        />

        <StatsCard
          title="Pending Requests"
          value={stats.pendingLeaveRequests}
          icon={Clock}
          description="Leave requests awaiting approval"
          delay={0.3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Staff Currently On Leave
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.staffOnLeaveList.length === 0 ? (
                <p className="text-muted-foreground text-sm">No staff currently on leave</p>
              ) : (
                <div className="space-y-4">
                  {stats.staffOnLeaveList.map((staff, index) => (
                    <motion.div
                      key={staff.staffId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{staff.staffName}</p>
                          <p className="text-sm text-muted-foreground">{staff.department}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-xs">
                              <span className="text-muted-foreground">Leave dates:</span>{' '}
                              {format(parseISO(staff.startDate), 'MMM dd')} - {format(parseISO(staff.endDate), 'MMM dd, yyyy')}
                            </p>
                            <p className="text-xs">
                              <span className="text-muted-foreground">Returns in:</span>{' '}
                              <span className="font-semibold">{staff.daysUntilReturn} days</span>
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadCertificate(staff.leaveRequestId)}
                          disabled={downloadingId === staff.leaveRequestId}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {downloadingId === staff.leaveRequestId ? 'Downloading...' : 'Certificate'}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
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
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Completion Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{totalDocumentsRequired}</p>
                    <p className="text-xs text-muted-foreground">Total required documents</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                  {Object.entries(stats.documentCompletionStats).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        {status === 'MISSING' && <AlertCircle className="h-4 w-4 text-red-500" />}
                        {status === 'SUBMITTED' && <Clock className="h-4 w-4 text-yellow-500" />}
                        {status === 'APPROVED' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        <span className="capitalize">{status.toLowerCase()}</span>
                      </span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>

                {missingDocuments > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-semibold">
                      <AlertCircle className="inline h-4 w-4 mr-1" />
                      {missingDocuments} documents need attention
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
