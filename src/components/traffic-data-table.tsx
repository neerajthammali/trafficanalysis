'use client';

import type { RecordedTrafficData } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface TrafficDataTableProps {
  data: RecordedTrafficData[];
}

export function TrafficDataTable({ data }: TrafficDataTableProps) {
  
  const getBadgeVariant = (rating: string) => {
    switch (rating) {
      case 'High': return 'destructive';
      case 'Moderate': return 'secondary';
      default: return 'outline';
    }
  }

  return (
    <div className="border rounded-md">
        <Table>
            {data.length === 0 && <TableCaption>No traffic data recorded yet.</TableCaption>}
            <TableHeader>
                <TableRow>
                <TableHead>Interval</TableHead>
                <TableHead className="text-right">2W</TableHead>
                <TableHead className="text-right">3W</TableHead>
                <TableHead className="text-right">4W</TableHead>
                <TableHead className="text-right">Heavy</TableHead>
                <TableHead>Jams</TableHead>
                <TableHead>Delays</TableHead>
                <TableHead>Wrong Dir.</TableHead>
                <TableHead>Locality</TableHead>
                <TableHead>Cause</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((entry) => (
                <TableRow key={entry.id} className="transition-all hover:bg-muted/50">
                    <TableCell className="font-medium">{entry.timeInterval}</TableCell>
                    <TableCell className="text-right">{entry.twoWheelers}</TableCell>
                    <TableCell className="text-right">{entry.threeWheelers}</TableCell>
                    <TableCell className="text-right">{entry.fourWheelers}</TableCell>
                    <TableCell className="text-right">{entry.heavyVehicles}</TableCell>
                    <TableCell><Badge variant={getBadgeVariant(entry.jams)}>{entry.jams}</Badge></TableCell>
                    <TableCell><Badge variant={getBadgeVariant(entry.delays)}>{entry.delays}</Badge></TableCell>
                    <TableCell><Badge variant={getBadgeVariant(entry.wrongDirection)}>{entry.wrongDirection}</Badge></TableCell>
                    <TableCell><Badge variant="outline">{entry.locality}</Badge></TableCell>
                    <TableCell><Badge variant="outline">{entry.congestionCause}</Badge></TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
