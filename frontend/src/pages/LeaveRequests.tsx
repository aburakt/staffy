import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { leaveRequestApi, certificateApi, exportApi } from '@/services/api';
import type { LeaveRequest } from '@/types';
import { LeaveStatus } from '@/types';
import { Plus, Check, X, Download, FileDown } from 'lucide-react';
import { LoadingSpinner } from '@/components/animated/LoadingSpinner';

export default function LeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    loadLeaveRequests();
  }, []);

  const loadLeaveRequests = async () => {
    try {
      const data = await leaveRequestApi.getAll();
      setLeaveRequests(data);
    } catch (error) {
      console.error('Failed to load leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await leaveRequestApi.approve(id);
      alert('Leave request approved!');
      loadLeaveRequests();
    } catch (error: any) {
      console.error('Failed to approve leave request:', error);
      alert(error.message || 'Failed to approve leave request');
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await leaveRequestApi.reject(id, reason);
      alert('Leave request rejected!');
      loadLeaveRequests();
    } catch (error) {
      console.error('Failed to reject leave request:', error);
      alert('Failed to reject leave request');
    }
  };

  const handleDownloadCertificate = async (id: number) => {
    try {
      setDownloadingId(id);
      const blob = await certificateApi.downloadLeaveCertificate(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `izin-belgesi-${id}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download certificate:', error);
      alert('Failed to download certificate');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportApi.exportLeaveRequests();
      exportApi.downloadBlob(blob, 'leave_requests.csv');
    } catch (error) {
      console.error('Failed to export leave requests:', error);
      alert('Failed to export leave requests data');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leave Requests</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
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
          {loading ? (
            <LoadingSpinner />
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
                            <Button variant="ghost" size="sm" onClick={() => handleApprove(leave.id!)}>
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleReject(leave.id!)}>
                              <X className="h-4 w-4 text-red-600" />
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
                            <Download className="h-4 w-4 text-blue-600" />
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
