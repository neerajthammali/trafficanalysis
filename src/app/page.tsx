'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TrafficData, RecordedTrafficData, AnalysisResult, VehicleChartData, TrafficDetailsData } from '@/lib/types';
import { TrafficDetailsSchema } from '@/lib/types';
import { getTrafficInsights } from '@/lib/actions';
import { TrafficDetailsForm } from '@/components/traffic-form';
import { TrafficAnalysis } from '@/components/traffic-analysis';
import { TrafficDataTable } from '@/components/traffic-data-table';
import { useToast } from "@/hooks/use-toast";
import { Faq } from '@/components/faq';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrafficChart } from '@/components/traffic-chart';
import { CounterInput } from '@/components/counter-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bike, Car, CarFront, Users, Truck, Timer, Play, Redo, LoaderCircle, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toPng } from 'html-to-image';


const vehicleTypes = [
  { name: 'twoWheelers', label: '2-Wheelers', icon: Bike },
  { name: 'threeWheelers', label: '3-Wheelers', icon: CarFront },
  { name: 'fourWheelers', label: '4-Wheelers', icon: Car },
  { name: 'heavyVehicles', label: 'Heavy Vehicles', icon: Truck },
] as const;

function PageHeader() {
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
  const [surveyStep, setSurveyStep] = useState<'idle' | 'running' | 'details' | 'analyzing' | 'complete'>('idle');
  const [duration, setDuration] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [vehicleCounts, setVehicleCounts] = useState({ twoWheelers: 0, threeWheelers: 0, fourWheelers: 0, heavyVehicles: 0 });
  
  const [recordedData, setRecordedData] = useState<RecordedTrafficData[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const { toast } = useToast();
  const chartRef = useRef<HTMLDivElement>(null);
  const reportSectionRef = useRef<HTMLDivElement>(null);


  const form = useForm<TrafficDetailsData>({
    resolver: zodResolver(TrafficDetailsSchema),
    defaultValues: {
        humanFlow: 'Normal',
        jams: 'Normal',
        delays: 'Normal',
        signals: 'Normal',
        wrongDirection: 'Less',
        locality: 'Mixed-use',
        congestionCause: 'Peak Hour Rush',
        remarks: '',
    }
  });

  useEffect(() => {
    if (surveyStep !== 'running' || timeLeft <= 0) {
      if (surveyStep === 'running') setSurveyStep('details');
      return;
    };

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [surveyStep, timeLeft]);

  const totalVehicles = useMemo(() => {
    return Object.values(vehicleCounts).reduce((sum, count) => sum + count, 0);
  }, [vehicleCounts]);

  const chartData: VehicleChartData[] = useMemo(() => [
    { name: '2-Wheelers', value: vehicleCounts.twoWheelers, fill: 'hsl(var(--chart-1))' },
    { name: '3-Wheelers', value: vehicleCounts.threeWheelers, fill: 'hsl(var(--chart-2))' },
    { name: '4-Wheelers', value: vehicleCounts.fourWheelers, fill: 'hsl(var(--chart-3))' },
    { name: 'Heavy', value: vehicleCounts.heavyVehicles, fill: 'hsl(var(--chart-4))' },
  ], [vehicleCounts]);

  const handleStartSurvey = () => {
    if (duration > 0) {
      setTimeLeft(duration * 60);
      setSurveyStep('running');
    }
  };
  
  const handleFinishEarly = () => {
    setTimeLeft(0);
    setSurveyStep('details');
  };

  const handleDetailsSubmit = async (details: TrafficDetailsData) => {
    setIsLoading(true);
    setSurveyStep('analyzing');

    const now = new Date();
    const isPeakTime = (now.getHours() >= 8 && now.getHours() <= 10) || (now.getHours() >= 17 && now.getHours() <= 19);

    const fullData: TrafficData = {
      ...vehicleCounts,
      ...details,
      timeInterval: `${duration} minute(s)`,
      trafficTime: isPeakTime ? 'Peak Time' : 'Normal Time',
    };

    const newEntry = { ...fullData, id: now.toISOString() };
    setRecordedData(prev => [newEntry, ...prev]);

    try {
      const result = await getTrafficInsights(fullData);
      setAnalysisResult(result);
      setSurveyStep('complete');
    } catch (error) {
      console.error("Failed to get traffic insights:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error processing your request. Please try again.",
      });
      setSurveyStep('details'); // Go back to details step on failure
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setSurveyStep('idle');
    setVehicleCounts({ twoWheelers: 0, threeWheelers: 0, fourWheelers: 0, heavyVehicles: 0 });
    setAnalysisResult(null);
    form.reset();
  }
  
  const handleExportPdf = async () => {
    if (!analysisResult || !chartRef.current) {
        toast({ variant: 'destructive', title: 'Report content not available.' });
        return;
    }
    setIsPdfLoading(true);

    try {
        const doc = new jsPDF();
        const chartImage = await toPng(chartRef.current, { cacheBust: true, pixelRatio: 2 });
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text('Traffic Analysis Report', 15, 20);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 26);
        doc.setLineWidth(0.5);
        doc.line(15, 28, 195, 28);

        let yPos = 35;

        doc.addImage(chartImage, 'PNG', 15, yPos, 180, 100);
        yPos += 110;

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('AI-Powered Insights', 15, yPos);
        yPos += 8;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Conclusion & Precautions', 15, yPos);
        yPos += 6;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const analysisText = `Conclusion: ${analysisResult.analysis.conclusion}\n\nPrecautions: ${analysisResult.analysis.precautions}`;
        const splitAnalysisText = doc.splitTextToSize(analysisText, 180);
        doc.text(splitAnalysisText, 15, yPos);
        yPos += (splitAnalysisText.length * 4) + 10;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Development Suggestions', 15, yPos);
        yPos += 6;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const suggestionsText = analysisResult.improvements.suggestions;
        const splitSuggestionsText = doc.splitTextToSize(suggestionsText, 180);
        doc.text(splitSuggestionsText, 15, yPos);
        
        if (recordedData.length > 0) {
            doc.addPage();
            yPos = 20;

            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Survey Data', 15, yPos);
            yPos += 10;

            (doc as any).autoTable({
                startY: yPos,
                head: [['Interval', '2W', '3W', '4W', 'Heavy', 'Jams', 'Delays', 'Wrong Dir.', 'Locality', 'Cause', 'Remarks']],
                body: recordedData.map(entry => [
                    entry.timeInterval,
                    entry.twoWheelers,
                    entry.threeWheelers,
                    entry.fourWheelers,
                    entry.heavyVehicles,
                    entry.jams,
                    entry.delays,
                    entry.wrongDirection,
                    entry.locality,
                    entry.congestionCause,
                    entry.remarks || 'N/A'
                ]),
                theme: 'grid',
                headStyles: { fillColor: [22, 160, 133] },
            });
        }
        
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
        }

        doc.save('traffic-report.pdf');

    } catch (error) {
        console.error('Failed to export PDF:', error);
        toast({
            variant: 'destructive',
            title: 'PDF Export Failed',
            description: 'An error occurred while generating the PDF.',
        });
    } finally {
        setIsPdfLoading(false);
    }
  };


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const renderContent = () => {
    switch(surveyStep) {
      case 'idle':
        return (
          <Card className="max-w-md mx-auto shadow-lg">
            <CardHeader>
              <CardTitle>Setup Survey</CardTitle>
              <CardDescription>Set the duration for your traffic survey.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="duration">Survey Duration (minutes)</Label>
                  <Input 
                    type="number" 
                    id="duration" 
                    value={duration} 
                    onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="text-center text-lg w-32 mx-auto"
                  />
              </div>
              <Button onClick={handleStartSurvey} size="lg" className="w-full">
                <Play className="mr-2" /> Start Survey
              </Button>
            </CardContent>
          </Card>
        );
      case 'running':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Counting Vehicles</CardTitle>
                <CardDescription>Use the counters below to record passing vehicles.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {vehicleTypes.map((vehicle) => (
                    <div key={vehicle.name} className="flex items-center justify-between">
                      <Label className="flex items-center gap-2 font-medium">
                        <vehicle.icon className="h-5 w-5 text-primary" /> {vehicle.label}
                      </Label>
                      <CounterInput 
                        value={vehicleCounts[vehicle.name]} 
                        onChange={(count) => setVehicleCounts(p => ({...p, [vehicle.name]: count}))} 
                      />
                    </div>
                  ))}
              </CardContent>
            </Card>
            <div className="flex flex-col items-center justify-center gap-6 p-8 bg-card rounded-lg shadow-lg">
              <div className="flex items-center gap-2 text-primary">
                <Timer className="h-8 w-8" />
                <CardTitle>Time Remaining</CardTitle>
              </div>
              <p className="font-mono text-6xl font-bold">{formatTime(timeLeft)}</p>
              <Button onClick={handleFinishEarly} variant="secondary" className="w-full">Finish & Enter Details</Button>
            </div>
          </div>
        );
      case 'details':
      case 'analyzing':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1">
              {surveyStep === 'details' ? (
                <TrafficDetailsForm form={form} onSubmit={handleDetailsSubmit} isLoading={isLoading} />
              ) : ( // This covers the 'analyzing' state
                <div className="flex flex-col gap-4 sticky top-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalVehicles}</div>
                      <p className="text-xs text-muted-foreground">Recorded in {duration} minute(s)</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
            <div className="md:col-span-2 space-y-8">
              <div className="bg-card p-2 rounded-lg"><TrafficChart data={chartData} /></div>
              <TrafficAnalysis analysisResult={analysisResult} isLoading={isLoading} />
            </div>
          </div>
        );
      case 'complete':
        return (
          <div className="space-y-8">
            <Card>
                <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                     <div className="text-center sm:text-left flex-1">
                        <h3 className="text-lg font-semibold">Survey Complete!</h3>
                        <p className="text-sm text-muted-foreground">Your report is ready below. You can start a new survey or download your results as a PDF.</p>
                     </div>
                     <div className="flex flex-wrap items-center justify-center gap-2">
                        <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto"><Redo className="mr-2" /> New Survey</Button>
                        <Button onClick={handleExportPdf} disabled={!analysisResult || isPdfLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                          {isPdfLoading ? <LoaderCircle className="mr-2 animate-spin" /> : <Download className="mr-2" />}
                          Download PDF
                        </Button>
                     </div>
                </CardContent>
            </Card>

            <div ref={reportSectionRef} className="p-4 sm:p-8 bg-background dark:bg-card rounded-lg border shadow-lg space-y-8">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold text-primary">Traffic Analysis Report</h2>
                    <p className="text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                
                <div ref={chartRef} className="bg-card p-2 rounded-lg">
                    <TrafficChart data={chartData} />
                </div>
                
                <TrafficAnalysis analysisResult={analysisResult} isLoading={false} />
                
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Survey Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TrafficDataTable data={recordedData} />
                    </CardContent>
                </Card>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader />
      {renderContent()}

      <div className="mt-16 space-y-8">
        <Faq />
      </div>
    </main>
  );
}
