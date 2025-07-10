
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AnalysisResult } from '@/lib/types';
import { FileText, Wrench } from 'lucide-react';

interface TrafficAnalysisProps {
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
}

export function TrafficAnalysis({ analysisResult, isLoading }: TrafficAnalysisProps) {
  const renderSkeletons = () => (
    <>
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
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
    </>
  );

  const renderContent = () => {
    if (!analysisResult) return null;
    const { analysis, improvements } = analysisResult;
    return (
      <>
        <Card className="shadow-lg h-full">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-xl text-primary">
              <FileText className="h-5 w-5" /> Analysis & Precautions
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
        <Card className="shadow-lg h-full">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-xl text-accent">
              <Wrench className="h-5 w-5" /> Development Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>{improvements.suggestions}</p>
          </CardContent>
        </Card>
      </>
    );
  };
  
  if (isLoading) return renderSkeletons();
  if (!analysisResult && !isLoading) return null;
  return renderContent();
}
