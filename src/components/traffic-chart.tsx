'use client';

import { BarChart as RechartsBarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { VehicleChartData } from '@/lib/types';
import { BarChart2 as BarChartIcon } from 'lucide-react';

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
            <BarChartIcon className="h-8 w-8 mr-2" />
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
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <RechartsBarChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" radius={4}>
              {data.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ChartContainer>
        <div className="flex items-center justify-center gap-x-4 gap-y-2 flex-wrap pt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
