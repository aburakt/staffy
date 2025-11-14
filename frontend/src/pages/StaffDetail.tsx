import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { LoadingSpinner } from '@/components/animated/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { useStaffById } from '@/hooks/useStaff';
import { useLeaveRequestsByStaff } from '@/hooks/useLeaveRequests';
import { useDocumentsByStaff } from '@/hooks/useDocuments';

export default function StaffDetail() {
  const { id } = useParams<{ id: string }>();
  const staffId = id ? parseInt(id) : 0;

  const { data: staff, isLoading: staffLoading, error: staffError, refetch: refetchStaff } = useStaffById(staffId);
  const { data: leaveRequests = [], isLoading: leavesLoading } = useLeaveRequestsByStaff(staffId);
  const { data: documents = [], isLoading: docsLoading } = useDocumentsByStaff(staffId);

  const isLoading = staffLoading || leavesLoading || docsLoading;

  if (staffLoading) {
    return <LoadingSpinner />;
  }

  if (staffError) {
    return <ErrorState error={staffError} onRetry={() => refetchStaff()} />;
  }

  if (!staff) {
    return <ErrorState title="Staff member not found" message="The requested staff member could not be found" />;
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
            <CardTitle>Personal Information</CardTitle>
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
              <span>DOB: {staff.dateOfBirth}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Position:</span>
              <span className="font-medium">{staff.position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Department:</span>
              <span className="font-medium">{staff.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hire Date:</span>
              <span className="font-medium">{staff.hireDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Annual Leave:</span>
              <span className="font-medium">{staff.annualLeaveDays} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Used Leave:</span>
              <span className="font-medium">{staff.usedLeaveDays} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Remaining Leave:</span>
              <span className="font-bold text-primary">{staff.remainingLeaveDays} days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>{leave.leaveType}</TableCell>
                  <TableCell>{leave.startDate}</TableCell>
                  <TableCell>{leave.endDate}</TableCell>
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
                      {leave.status}
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
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Uploaded By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.documentName}</TableCell>
                  <TableCell>{doc.documentType}</TableCell>
                  <TableCell>{new Date(doc.uploadDate!).toLocaleDateString()}</TableCell>
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
