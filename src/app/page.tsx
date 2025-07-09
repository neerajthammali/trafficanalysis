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
        <TrafficDataTable data={recordedData} />
      </div>
      <div className="mt-12">
        <TrafficInfo />
      </div>
    </main>
  );
}
