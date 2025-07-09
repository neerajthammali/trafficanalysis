'use client';

import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { VehicleChartData } from '@/lib/types';
import { PieChart as PieChartIcon } from 'lucide-react';

interface TrafficChartProps {
  data: VehicleChartData[];
}

export function TrafficChart({ data }: TrafficChartProps) {
  const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  if (totalValue === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Distribution</CardTitle>
          <CardDescription>Awaiting vehicle counts.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-muted-foreground">
            <PieChartIcon className="h-8 w-8 mr-2" />
            <span>No chart to display</span>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = data.reduce((acc, item) => {
    acc[item.name] = { label: item.name, color: item.fill };
    return acc;
  }, {} as any);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Distribution</CardTitle>
        <CardDescription>Distribution of vehicle types in the recorded period.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <RechartsPieChart>
            <Tooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (percent * 100) > 5 ? (
                  <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                ) : null;
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend content={() => <p className="text-sm text-center text-muted-foreground mt-2">Vehicle distribution by type.</p>} />
          </RechartsPieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
