import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { certificateApi, exportApi } from '@/services/api';
import { useDashboardStats } from '@/hooks/useDashboard';
import { Users, Calendar, Clock, CheckCircle, FileText, AlertCircle, Download, Loader2 } from 'lucide-react';
import { StatsCard } from '@/components/animated/StatsCard';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n/useTranslation';

export default function Dashboard() {
  const { t } = useTranslation();
  const { data: stats, isLoading, error, refetch } = useDashboardStats();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleDownloadCertificate = async (staffId: number) => {
    if (downloadingId) return; // Prevent spam clicks

    try {
      setDownloadingId(staffId);
      // Note: We don't have leaveRequestId from dashboard stats, so we'll skip this for now
      // In a real app, you'd need to fetch the leave request ID or pass it from the backend
      toast.info('Certificate download will be implemented with leave request ID');
    } catch (error) {
      toast.error('Failed to download certificate');
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  if (!stats) {
    return <ErrorState title={t.dashboard.noDataAvailable} message={t.dashboard.somethingWentWrong} />;
  }

  const totalDocumentsRequired = stats.totalDocumentsRequired || 0;
  const totalDocumentsUploaded = stats.totalDocumentsUploaded || 0;
  const missingDocuments = totalDocumentsRequired - totalDocumentsUploaded;

  return (
    <div className="space-y-6">
      <motion.h1
        className="text-3xl font-bold"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t.dashboard.title}
      </motion.h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t.dashboard.stats.totalStaff}
          value={stats.totalStaff}
          icon={Users}
          description="Sistemdeki toplam çalışan sayısı"
          delay={0}
        />

        <StatsCard
          title={t.dashboard.stats.activeStaff}
          value={stats.activeStaff}
          icon={CheckCircle}
          description="Şu anda aktif çalışanlar"
          delay={0.1}
        />

        <StatsCard
          title={t.dashboard.stats.onLeave}
          value={stats.onLeaveStaff}
          icon={Calendar}
          description="Şu anda izinde olan personel"
          delay={0.2}
        />

        <StatsCard
          title={t.dashboard.stats.pendingLeaveRequests}
          value={stats.pendingLeaveRequests}
          icon={Clock}
          description="Onay bekleyen izin talepleri"
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
                Şu Anda İzinde Olan Personel
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.staffOnLeaveList.length === 0 ? (
                <p className="text-muted-foreground text-sm">Şu anda izinde olan personel yok</p>
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
                          <p className="text-sm text-muted-foreground">{staff.leaveType}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-xs">
                              <span className="text-muted-foreground">İzin tarihleri:</span>{' '}
                              {format(parseISO(staff.startDate), 'dd MMM', { locale: tr })} - {format(parseISO(staff.endDate), 'dd MMM yyyy', { locale: tr })}
                            </p>
                            <p className="text-xs">
                              <span className="text-muted-foreground">Dönüş:</span>{' '}
                              <span className="font-semibold">{staff.daysUntilReturn} gün sonra</span>
                            </p>
                          </div>
                        </div>
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
                Belge Tamamlanma Durumu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{totalDocumentsRequired}</p>
                    <p className="text-xs text-muted-foreground">Toplam gerekli belge</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Yüklenen</span>
                    </span>
                    <span className="font-semibold">{totalDocumentsUploaded}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span>Eksik</span>
                    </span>
                    <span className="font-semibold">{missingDocuments}</span>
                  </div>
                </div>

                {stats.documentCompletionStats && Object.keys(stats.documentCompletionStats).length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <FileText className="inline h-4 w-4 mr-1" />
                      Eksik belgeye sahip personel
                    </p>
                    <div className="mt-2 space-y-1">
                      {Object.entries(stats.documentCompletionStats).slice(0, 3).map(([name, count]) => (
                        <p key={name} className="text-xs text-blue-700">
                          {name}: {count} eksik
                        </p>
                      ))}
                      {Object.keys(stats.documentCompletionStats).length > 3 && (
                        <p className="text-xs text-blue-600 italic">
                          +{Object.keys(stats.documentCompletionStats).length - 3} daha fazla...
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {missingDocuments > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-semibold">
                      <AlertCircle className="inline h-4 w-4 mr-1" />
                      {missingDocuments} belge dikkat gerektiriyor
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
