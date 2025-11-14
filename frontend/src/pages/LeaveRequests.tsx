import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { certificateApi, exportApi } from '@/services/api';
import { useLeaveRequests, useApproveLeaveRequest, useRejectLeaveRequest } from '@/hooks/useLeaveRequests';
import { LeaveStatus } from '@/types';
import { Plus, Check, X, Download, FileDown, Loader2 } from 'lucide-react';
import { TableSkeleton } from '@/components/skeletons/TableSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n/useTranslation';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function LeaveRequests() {
  const { t } = useTranslation();
  const { data: leaveRequests = [], isLoading, error, refetch } = useLeaveRequests();
  const approveMutation = useApproveLeaveRequest();
  const rejectMutation = useRejectLeaveRequest();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [exportingData, setExportingData] = useState(false);

  const handleApprove = async (id: number) => {
    try {
      await approveMutation.mutateAsync(id);
      toast.success(t.leave.approveSuccess);
    } catch (error: any) {
      toast.error(error.message || t.leave.approveError);
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Red sebepini giriniz:');
    if (!reason || !reason.trim()) {
      toast.warning('Red sebebi gereklidir');
      return;
    }

    try {
      await rejectMutation.mutateAsync({ id, reason });
      toast.success(t.leave.rejectSuccess);
    } catch (error: any) {
      toast.error(error.message || t.leave.rejectError);
    }
  };

  const handleDownloadCertificate = async (id: number) => {
    if (downloadingId) return;

    try {
      setDownloadingId(id);
      const blob = await certificateApi.downloadLeaveCertificate(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `izin-belgesi-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Belge indirildi');
    } catch (error) {
      toast.error(t.leave.downloadError);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleExport = async () => {
    if (exportingData) return;

    try {
      setExportingData(true);
      const blob = await exportApi.exportLeaveRequests();
      exportApi.downloadBlob(blob, 'izin-talepleri.csv');
      toast.success(t.leave.exportSuccess);
    } catch (error) {
      console.error('Failed to export leave requests:', error);
      toast.error(t.leave.exportError);
    } finally {
      setExportingData(false);
    }
  };

  if (isLoading) {
    return <TableSkeleton rows={5} columns={7} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t.leave.title}</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport} disabled={exportingData}>
            {exportingData ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="mr-2 h-4 w-4" />
            )}
            {t.common.exportCsv}
          </Button>
          <Link to="/leave-requests/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t.leave.addRequest}
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm İzin Talepleri</CardTitle>
        </CardHeader>
        <CardContent>
          {leaveRequests.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">{t.leave.noRequests}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Personel</TableHead>
                  <TableHead>{t.leave.leaveType}</TableHead>
                  <TableHead>{t.leave.startDate}</TableHead>
                  <TableHead>{t.leave.endDate}</TableHead>
                  <TableHead>{t.leave.daysRequested}</TableHead>
                  <TableHead>{t.leave.status}</TableHead>
                  <TableHead>{t.leave.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell className="font-medium">{leave.staffName}</TableCell>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>{format(new Date(leave.startDate), 'dd MMM yyyy', { locale: tr })}</TableCell>
                    <TableCell>{format(new Date(leave.endDate), 'dd MMM yyyy', { locale: tr })}</TableCell>
                    <TableCell>{leave.daysRequested}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          leave.status === LeaveStatus.APPROVED
                            ? 'bg-green-100 text-green-800'
                            : leave.status === LeaveStatus.PENDING
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {leave.status === LeaveStatus.APPROVED ? t.leave.approved :
                         leave.status === LeaveStatus.PENDING ? t.leave.pending :
                         t.leave.rejected}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {leave.status === LeaveStatus.PENDING && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(leave.id!)}
                              disabled={approveMutation.isPending || rejectMutation.isPending}
                            >
                              {approveMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                              ) : (
                                <Check className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReject(leave.id!)}
                              disabled={approveMutation.isPending || rejectMutation.isPending}
                            >
                              {rejectMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                              ) : (
                                <X className="h-4 w-4 text-red-600" />
                              )}
                            </Button>
                          </>
                        )}
                        {leave.status === LeaveStatus.APPROVED && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadCertificate(leave.id!)}
                            disabled={downloadingId === leave.id}
                          >
                            {downloadingId === leave.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
