'use client';

import { useState } from 'react';
import type { TrafficData, RecordedTrafficData, AnalysisResult } from '@/lib/types';
import { getTrafficInsights } from '@/lib/actions';
import { TrafficForm } from '@/components/traffic-form';
import { TrafficAnalysis } from '@/components/traffic-analysis';
import { TrafficDataTable } from '@/components/traffic-data-table';
import { useToast } from "@/hooks/use-toast";
import { TrafficInfo } from '@/components/traffic-info';

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

export default function Home() {
  const [recordedData, setRecordedData] = useState<RecordedTrafficData[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: TrafficData) => {
    setIsLoading(true);
    const newEntry = { ...data, id: new Date().toISOString() };
    
    setRecordedData(prev => [newEntry, ...prev]);

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

    // Title
    doc.setFontSize(20);
    doc.text('Traffic Analysis Report', 14, yPos);
    yPos += 15;

    // Analysis
    doc.setFontSize(16);
    doc.text('AI-Powered Analysis', 14, yPos);
    yPos += 8;
    doc.setFontSize(11);
    const analysisLines = doc.splitTextToSize(
      `Conclusion: ${analysisResult.analysis.conclusion}\n\nRecommendations: ${analysisResult.analysis.recommendations}`,
      180
    );
    doc.text(analysisLines, 14, yPos);
    yPos += analysisLines.length * 5 + 10;

    // Improvements
    doc.setFontSize(16);
    doc.text('Improvement Suggestions', 14, yPos);
    yPos += 8;
    doc.setFontSize(11);
    const improvementLines = doc.splitTextToSize(
      analysisResult.improvements.suggestions,
      180
    );
    doc.text(improvementLines, 14, yPos);
    yPos += improvementLines.length * 5 + 5;


    // Data Table
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
      headStyles: { fillColor: '#16a34a' }, // Accent color
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
        <div className="lg:col-span-3">
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
