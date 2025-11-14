import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { certificateApi, exportApi } from '@/services/api';
import { useLeaveRequests, useApproveLeaveRequest, useRejectLeaveRequest } from '@/hooks/useLeaveRequests';
import { LeaveStatus } from '@/types';
import { Plus, Check, X, Download, FileDown, Loader2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/animated/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { toast } from 'sonner';

export default function LeaveRequests() {
  const { data: leaveRequests = [], isLoading, error, refetch } = useLeaveRequests();
  const approveMutation = useApproveLeaveRequest();
  const rejectMutation = useRejectLeaveRequest();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [exportingData, setExportingData] = useState(false);

  const handleApprove = async (id: number) => {
    try {
      await approveMutation.mutateAsync(id);
      toast.success('Leave request approved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve leave request');
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason || !reason.trim()) {
      toast.warning('Rejection reason is required');
      return;
    }

    try {
      await rejectMutation.mutateAsync({ id, reason });
      toast.success('Leave request rejected');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject leave request');
    }
  };

  const handleDownloadCertificate = async (id: number) => {
    if (downloadingId) return; // Prevent multiple downloads

    try {
      setDownloadingId(id);
      const blob = await certificateApi.downloadLeaveCertificate(id);
      exportApi.downloadBlob(blob, `izin-belgesi-${id}.docx`);
      toast.success('Certificate downloaded successfully');
    } catch (error) {
      toast.error('Failed to download certificate');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleExport = async () => {
    if (exportingData) return; // Prevent spam clicks

    try {
      setExportingData(true);
      const blob = await exportApi.exportLeaveRequests();
      exportApi.downloadBlob(blob, 'leave_requests.csv');
      toast.success('Leave requests exported successfully');
    } catch (error) {
      toast.error('Failed to export leave requests');
    } finally {
      setExportingData(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leave Requests</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exportingData}
          >
            {exportingData ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="mr-2 h-4 w-4" />
            )}
            Export CSV
          </Button>
          <Link to="/leaves/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Leave Request
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {leaveRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No leave requests found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell className="font-medium">
                      {leave.staff?.firstName} {leave.staff?.lastName}
                    </TableCell>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>{leave.startDate}</TableCell>
                    <TableCell>{leave.endDate}</TableCell>
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
                        {leave.status}
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
                              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                            ) : (
                              <Download className="h-4 w-4 text-blue-600" />
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
