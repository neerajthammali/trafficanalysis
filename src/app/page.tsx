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
import { Bike, Car, CarFront, Users, Truck, Timer, Play, Redo, LoaderCircle, Download, Share2 } from 'lucide-react';

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
  
  const handleExportPDF = async () => {
    if (!analysisResult || recordedData.length === 0) {
      toast({ variant: 'destructive', title: 'No Data to Export' });
      return;
    }

    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const { toPng } = await import('html-to-image');

    const doc = new jsPDF();
    let yPos = 22;

    doc.setFontSize(20);
    doc.text('Traffic Analysis Report', 14, yPos);
    yPos += 15;
    
    if (chartRef.current) {
        try {
            const dataUrl = await toPng(chartRef.current, { cacheBust: true });
            doc.setFontSize(16);
            doc.text('Vehicle Distribution', 14, yPos);
            yPos += 8;
            doc.addImage(dataUrl, 'PNG', 14, yPos, 180, 100);
            yPos += 110;
        } catch (error) {
            console.error('oops, something went wrong!', error);
        }
    }


    doc.setFontSize(16);
    doc.text('AI-Powered Analysis & Precautions', 14, yPos);
    yPos += 8;
    doc.setFontSize(11);
    const analysisLines = doc.splitTextToSize(
      `Conclusion: ${analysisResult.analysis.conclusion}\n\nPrecautions: ${analysisResult.analysis.precautions}`, 180
    );
    doc.text(analysisLines, 14, yPos);
    yPos += analysisLines.length * 5 + 10;

    doc.setFontSize(16);
    doc.text('Development Suggestions', 14, yPos);
    yPos += 8;
    doc.setFontSize(11);
    const improvementLines = doc.splitTextToSize(analysisResult.improvements.suggestions, 180);
    doc.text(improvementLines, 14, yPos);
    yPos += improvementLines.length * 5 + 10;
    
    autoTable(doc, {
      startY: yPos,
      head: [['2-Wheel', '3-Wheel', '4-Wheel', 'Heavy', 'Jams', 'Delays', 'Wrong Dir.', 'Locality', 'Cause']],
      body: recordedData.map(entry => [
        entry.twoWheelers, entry.threeWheelers, entry.fourWheelers, entry.heavyVehicles,
        entry.jams, entry.delays, entry.wrongDirection, entry.locality, entry.congestionCause,
      ]),
      headStyles: { fillColor: 'hsl(var(--primary))' },
    });

    doc.save('traffic-report.pdf');
  };

  const handleShareImage = async () => {
    if (!reportSectionRef.current) {
      toast({ variant: 'destructive', title: 'Report content not available.' });
      return;
    }
    setIsLoading(true);

    try {
      const { toBlob } = await import('html-to-image');
      const blob = await toBlob(reportSectionRef.current, {
        cacheBust: true,
        backgroundColor: window.getComputedStyle(document.body).backgroundColor,
        pixelRatio: 1.5,
      });

      if (!blob) throw new Error('Image creation failed');

      const file = new File([blob], 'traffic-report.png', { type: blob.type });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Traffic Analysis Report',
          text: 'Here is my traffic analysis report.',
        });
      } else {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'traffic-report.png';
        link.click();
        URL.revokeObjectURL(link.href);
        toast({
          title: "Report Downloaded",
          description: "Web Share API is not available, the report was downloaded instead.",
        });
      }
    } catch (error) {
      console.error('Failed to share image:', error);
      toast({
        variant: 'destructive',
        title: 'Sharing Failed',
        description: 'An error occurred while trying to generate the image.',
      });
    } finally {
      setIsLoading(false);
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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2">
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
            <div className="lg:col-span-3 space-y-8">
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
                        <p className="text-sm text-muted-foreground">Your report is ready below. You can start a new survey or export your results.</p>
                     </div>
                     <div className="flex flex-wrap items-center justify-center gap-2">
                        <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto"><Redo className="mr-2" /> New Survey</Button>
                        <Button onClick={handleExportPDF} disabled={!analysisResult || isLoading} className="w-full sm:w-auto"><Download className="mr-2" /> Export PDF</Button>
                        <Button onClick={handleShareImage} disabled={!analysisResult || isLoading} className="w-full sm:w-auto">
                            {isLoading ? <LoaderCircle className="mr-2 animate-spin" /> : <Share2 className="mr-2" />}
                            Share Image
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
