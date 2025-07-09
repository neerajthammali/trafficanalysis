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
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface TrafficDataTableProps {
  data: RecordedTrafficData[];
  onExportPDF: () => void;
  isExportDisabled: boolean;
}

export function TrafficDataTable({ data, onExportPDF, isExportDisabled }: TrafficDataTableProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-2xl">Recorded Data</CardTitle>
          <Button onClick={onExportPDF} disabled={isExportDisabled} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
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
