import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { TableSkeleton } from '@/components/skeletons/TableSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { useStaffById } from '@/hooks/useStaff';
import { useLeaveRequestsByStaff } from '@/hooks/useLeaveRequests';
import { useDocumentsByStaff } from '@/hooks/useDocuments';
import { useTranslation } from '@/i18n/useTranslation';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function StaffDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const staffId = id ? parseInt(id) : 0;

  const { data: staff, isLoading: staffLoading, error: staffError, refetch: refetchStaff } = useStaffById(staffId);
  const { data: leaveRequests = [], isLoading: leavesLoading } = useLeaveRequestsByStaff(staffId);
  const { data: documents = [], isLoading: docsLoading } = useDocumentsByStaff(staffId);

  const isLoading = staffLoading || leavesLoading || docsLoading;

  if (staffLoading) {
    return <TableSkeleton rows={3} columns={4} />;
  }

  if (staffError) {
    return <ErrorState error={staffError} onRetry={() => refetchStaff()} />;
  }

  if (!staff) {
    return <ErrorState title={t.staff.staffNotFound} message={t.error.notFound} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/staff">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          {staff.firstName} {staff.lastName}
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.staff.personalInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{staff.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{staff.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{staff.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Doğum Tarihi: {staff.dateOfBirth}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.staff.employmentDetails}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.staff.position}:</span>
              <span className="font-medium">{staff.position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.staff.department}:</span>
              <span className="font-medium">{staff.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.staff.hireDate}:</span>
              <span className="font-medium">{staff.hireDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.staff.annualLeave}:</span>
              <span className="font-medium">{staff.annualLeaveDays} {t.staff.days}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.staff.usedLeave}:</span>
              <span className="font-medium">{staff.usedLeaveDays} {t.staff.days}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.staff.remainingLeave}:</span>
              <span className="font-bold text-primary">{staff.remainingLeaveDays} {t.staff.days}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.staff.leaveHistory}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.leave.leaveType}</TableHead>
                <TableHead>{t.leave.startDate}</TableHead>
                <TableHead>{t.leave.endDate}</TableHead>
                <TableHead>Gün Sayısı</TableHead>
                <TableHead>{t.leave.status}</TableHead>
                <TableHead>{t.leave.reason}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>{leave.leaveType}</TableCell>
                  <TableCell>{format(new Date(leave.startDate), 'dd MMM yyyy', { locale: tr })}</TableCell>
                  <TableCell>{format(new Date(leave.endDate), 'dd MMM yyyy', { locale: tr })}</TableCell>
                  <TableCell>{leave.daysRequested}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        leave.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : leave.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {leave.status === 'APPROVED' ? t.leave.approved :
                       leave.status === 'PENDING' ? t.leave.pending :
                       t.leave.rejected}
                    </span>
                  </TableCell>
                  <TableCell>{leave.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.documents.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.documents.documentName}</TableHead>
                <TableHead>{t.documents.documentType}</TableHead>
                <TableHead>{t.documents.uploadDate}</TableHead>
                <TableHead>{t.documents.uploadedBy}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.documentName}</TableCell>
                  <TableCell>{doc.documentType}</TableCell>
                  <TableCell>{doc.uploadDate ? format(new Date(doc.uploadDate), 'dd MMM yyyy', { locale: tr }) : '-'}</TableCell>
                  <TableCell>{doc.uploadedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
