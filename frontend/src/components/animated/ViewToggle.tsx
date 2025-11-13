import { motion } from 'framer-motion';
import { LayoutGrid, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewToggleProps {
  view: 'table' | 'card';
  onViewChange: (view: 'table' | 'card') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-background p-1">
      <Button
        variant={view === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        className="relative"
      >
        <Table className="h-4 w-4 mr-2" />
        Table
        {view === 'table' && (
          <motion.div
            layoutId="activeView"
            className="absolute inset-0 bg-primary rounded-md -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Button>
      <Button
        variant={view === 'card' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('card')}
        className="relative"
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Cards
        {view === 'card' && (
          <motion.div
            layoutId="activeView"
            className="absolute inset-0 bg-primary rounded-md -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Button>
    </div>
  );
}
