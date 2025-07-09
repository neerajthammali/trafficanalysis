'use client';

import { useState } from 'react';
import type { TrafficData, RecordedTrafficData, AnalysisResult, VehicleChartData } from '@/lib/types';
import { getTrafficInsights } from '@/lib/actions';
import { TrafficForm } from '@/components/traffic-form';
import { TrafficAnalysis } from '@/components/traffic-analysis';
import { TrafficDataTable } from '@/components/traffic-data-table';
import { useToast } from "@/hooks/use-toast";
import { TrafficInfo } from '@/components/traffic-info';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrafficChart } from '@/components/traffic-chart';
import { Users } from 'lucide-react';

function Header() {
  return (
    <header className="mb-12 text-center">
      <h1 className="font-headline text-4xl font-bold text-primary sm:text-5xl lg:text-6xl">
        Traffic Calculator
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
        Analyze traffic patterns and get AI-powered insights for urban planning.
      </p>
    </header>
  );
}

function TotalVehicleCard({ total }: { total: number | null }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {total === null ? (
           <div className="text-2xl font-bold">-</div>
        ) : (
          <div className="text-2xl font-bold">{total}</div>
        )}
        <p className="text-xs text-muted-foreground">In the selected interval</p>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const [recordedData, setRecordedData] = useState<RecordedTrafficData[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [chartData, setChartData] = useState<VehicleChartData[]>([]);
  const [totalVehicles, setTotalVehicles] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: TrafficData) => {
    setIsLoading(true);
    setAnalysisResult(null);
    const newEntry = { ...data, id: new Date().toISOString() };
    
    setRecordedData(prev => [newEntry, ...prev]);

    const { twoWheelers, threeWheelers, fourWheelers, heavyVehicles } = data;
    const total = twoWheelers + threeWheelers + fourWheelers + heavyVehicles;
    setTotalVehicles(total);

    setChartData([
      { name: '2-Wheelers', value: twoWheelers, fill: 'hsl(var(--chart-1))' },
      { name: '3-Wheelers', value: threeWheelers, fill: 'hsl(var(--chart-2))' },
      { name: '4-Wheelers', value: fourWheelers, fill: 'hsl(var(--chart-3))' },
      { name: 'Heavy', value: heavyVehicles, fill: 'hsl(var(--chart-4))' },
    ]);

    try {
      const result = await getTrafficInsights(data);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Failed to get traffic insights:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error processing your request. Please try again.",
      });
      setRecordedData(prev => prev.filter(item => item.id !== newEntry.id));
      setTotalVehicles(null);
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!analysisResult || recordedData.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Data to Export',
        description: 'Please generate an analysis before exporting.',
      });
      return;
    }

    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF();
    let yPos = 22;

    doc.setFontSize(20);
    doc.text('Traffic Analysis Report', 14, yPos);
    yPos += 15;

    doc.setFontSize(16);
    doc.text('AI-Powered Analysis & Precautions', 14, yPos);
    yPos += 8;
    doc.setFontSize(11);
    const analysisLines = doc.splitTextToSize(
      `Conclusion: ${analysisResult.analysis.conclusion}\n\nPrecautions: ${analysisResult.analysis.precautions}`,
      180
    );
    doc.text(analysisLines, 14, yPos);
    yPos += analysisLines.length * 5 + 10;

    doc.setFontSize(16);
    doc.text('Development Suggestions', 14, yPos);
    yPos += 8;
    doc.setFontSize(11);
    const improvementLines = doc.splitTextToSize(
      analysisResult.improvements.suggestions,
      180
    );
    doc.text(improvementLines, 14, yPos);
    yPos += improvementLines.length * 5 + 10;

    doc.setFontSize(16);
    doc.text('Observations from Last Entry', 14, yPos);
    yPos += 8;
    doc.setFontSize(11);
    const lastEntry = recordedData[0];
    const observationText = [
      `Human Flow: ${lastEntry.humanFlow}`,
      `Jams: ${lastEntry.jams}`,
      `Delays: ${lastEntry.delays}`,
      `Signals: ${lastEntry.signals}`,
      `Wrong Direction: ${lastEntry.wrongDirection}`,
    ].join('\n\n');
    const observationLines = doc.splitTextToSize(observationText, 180);
    doc.text(observationLines, 14, yPos);
    yPos += observationLines.length * 5 + 5;

    autoTable(doc, {
      startY: yPos,
      head: [['Interval', 'Time Type', '2-Wheelers', '3-Wheelers', '4-Wheelers', 'Heavy Vehicles']],
      body: recordedData.map(entry => [
        entry.timeInterval,
        entry.trafficTime,
        entry.twoWheelers,
        entry.threeWheelers,
        entry.fourWheelers,
        entry.heavyVehicles
      ]),
      headStyles: { fillColor: 'hsl(var(--primary))' },
    });

    doc.save('traffic-report.pdf');
  };

  const isExportDisabled = recordedData.length === 0 || !analysisResult;

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-2">
          <TrafficForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-3 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <TotalVehicleCard total={totalVehicles} />
              <TrafficChart data={chartData} />
            </div>
            <TrafficAnalysis analysisResult={analysisResult} isLoading={isLoading} />
        </div>
      </div>
      <div className="mt-12">
        <TrafficDataTable 
          data={recordedData} 
          onExportPDF={handleExportPDF} 
          isExportDisabled={isExportDisabled} 
        />
      </div>
      <div className="mt-12">
        <TrafficInfo />
      </div>
    </main>
  );
}
