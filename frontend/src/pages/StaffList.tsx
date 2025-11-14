import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { exportApi } from '@/services/api';
import { useStaff } from '@/hooks/useStaff';
import { Plus, Eye, Download, Loader2 } from 'lucide-react';
import { ViewToggle } from '@/components/animated/ViewToggle';
import { StaffCard } from '@/components/animated/StaffCard';
import { StaffListSkeleton } from '@/components/skeletons/StaffListSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n/useTranslation';

export default function StaffList() {
  const { t } = useTranslation();
  const [view, setView] = useState<'table' | 'card'>('table');
  const { data: staff = [], isLoading, error, refetch } = useStaff();
  const [exportingData, setExportingData] = useState(false);

  const handleExport = async () => {
    if (exportingData) return; // Prevent spam clicks

    try {
      setExportingData(true);
      const blob = await exportApi.exportStaff();
      exportApi.downloadBlob(blob, 'personel.csv');
      toast.success(t.staff.exportSuccess);
    } catch (error) {
      console.error('Failed to export staff:', error);
      toast.error(t.staff.exportError);
    } finally {
      setExportingData(false);
    }
  };

  if (isLoading) {
    return <StaffListSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
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
          {t.staff.title}
        </motion.h1>
        <div className="flex gap-3 items-center">
          <ViewToggle view={view} onViewChange={setView} />
          <Button variant="outline" onClick={handleExport} disabled={exportingData}>
            {exportingData ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {t.common.exportCsv}
          </Button>
          <Link to="/staff/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t.staff.addStaff}
            </Button>
          </Link>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'table' ? (
          <motion.div
            key="table-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Tüm Personel</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ad Soyad</TableHead>
                      <TableHead>{t.staff.email}</TableHead>
                      <TableHead>{t.staff.position}</TableHead>
                      <TableHead>{t.staff.department}</TableHead>
                      <TableHead>İzin Günleri</TableHead>
                      <TableHead>{t.staff.status}</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {member.firstName} {member.lastName}
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.position}</TableCell>
                        <TableCell>{member.department}</TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {member.remainingLeaveDays} / {member.annualLeaveDays}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              member.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {member.active ? t.staff.active : t.staff.inactive}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Link to={`/staff/${member.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="card-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {staff.map((member, index) => (
              <StaffCard key={member.id} staff={member} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
