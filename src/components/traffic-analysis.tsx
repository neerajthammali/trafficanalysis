'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AnalysisResult } from '@/lib/types';
import { FileText, Wrench } from 'lucide-react';

interface TrafficAnalysisProps {
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
}

export function TrafficAnalysis({ analysisResult, isLoading }: TrafficAnalysisProps) {
  const renderSkeletons = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    </div>
  );

  const renderPlaceholder = () => (
    <Card className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[400px]">
      <div className="p-4 bg-secondary rounded-full mb-4">
          <FileText className="h-12 w-12 text-primary" />
      </div>
      <CardTitle className="font-headline text-2xl">Awaiting Data</CardTitle>
      <CardDescription className="mt-2 max-w-xs">
        Submit traffic data using the form to generate an AI-powered analysis and see recommendations here.
      </CardDescription>
    </Card>
  );

  const renderContent = () => {
    if (!analysisResult) return null;
    const { analysis, improvements } = analysisResult;
    return (
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-2xl text-primary">
              <FileText className="h-6 w-6" /> Analysis & Precautions
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-4">
            <div>
              <h3 className="font-semibold">Conclusion</h3>
              <p>{analysis.conclusion}</p>
            </div>
            <div>
              <h3 className="font-semibold">Precautions</h3>
              <p>{analysis.precautions}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-2xl text-accent">
              <Wrench className="h-6 w-6" /> Development Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>{improvements.suggestions}</p>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  if (isLoading) return renderSkeletons();
  if (!analysisResult) return renderPlaceholder();
  return renderContent();
}
