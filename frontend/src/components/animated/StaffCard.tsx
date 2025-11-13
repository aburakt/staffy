import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Staff } from '@/types';
import { Mail, Phone, Briefcase, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StaffCardProps {
  staff: Staff;
  index: number;
}

export function StaffCard({ staff, index }: StaffCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-start justify-between">
            <div>
              <motion.h3
                className="font-semibold text-lg"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: index * 0.05 + 0.1 }}
              >
                {staff.firstName} {staff.lastName}
              </motion.h3>
              <p className="text-sm text-muted-foreground">{staff.position}</p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                staff.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {staff.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="flex items-center text-sm">
            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{staff.department}</span>
          </div>
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="truncate">{staff.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{staff.phone}</span>
          </div>
          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Leave Days:</span>
              <span className="font-semibold">
                {staff.remainingLeaveDays} / {staff.annualLeaveDays}
              </span>
            </div>
          </div>
          <Link to={`/staff/${staff.id}`}>
            <Button className="w-full" variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
