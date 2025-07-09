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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface TrafficDataTableProps {
  data: RecordedTrafficData[];
}

export function TrafficDataTable({ data }: TrafficDataTableProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Recorded Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
                {data.length === 0 && <TableCaption>No traffic data recorded yet.</TableCaption>}
                <TableHeader>
                    <TableRow>
                    <TableHead>Interval</TableHead>
                    <TableHead>Time Type</TableHead>
                    <TableHead className="text-right">2-Wheelers</TableHead>
                    <TableHead className="text-right">3-Wheelers</TableHead>
                    <TableHead className="text-right">4-Wheelers</TableHead>
                    <TableHead className="text-right">Heavy</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((entry) => (
                    <TableRow key={entry.id} className="transition-all hover:bg-muted/50">
                        <TableCell className="font-medium">{entry.timeInterval}</TableCell>
                        <TableCell>{entry.trafficTime}</TableCell>
                        <TableCell className="text-right">{entry.twoWheelers}</TableCell>
                        <TableCell className="text-right">{entry.threeWheelers}</TableCell>
                        <TableCell className="text-right">{entry.fourWheelers}</TableCell>
                        <TableCell className="text-right">{entry.heavyVehicles}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
