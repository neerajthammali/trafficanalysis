
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
import { Bike, Car, CarFront, Truck, Timer, Play, Redo, LoaderCircle, Download } from 'lucide-react';
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
        Traffic Analyzer
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
        Analyze traffic patterns and get AI-powered insights for urban planning.
      </p>
    </header>
  );
}

export default function Home() {
  const [surveyStep, setSurveyStep] = useState<'idle' | 'running' | 'details' | 'complete'>('idle');
  const [duration, setDuration] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [vehicleCounts, setVehicleCounts] = useState({ twoWheelers: 0, threeWheelers: 0, fourWheelers: 0, heavyVehicles: 0 });
  
  const [recordedData, setRecordedData] = useState<RecordedTrafficData[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const { toast } = useToast();
  const reportSectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);


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
    setSurveyStep('analyzing');
    setIsLoading(true);

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
    setSurveyStep('complete');
    
    try {
      const result = await getTrafficInsights(fullData);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Failed to get traffic insights:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "The AI failed to process the data. Please try again or check your API key.",
      });
      setAnalysisResult(null); // Clear previous results on error
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setSurveyStep('idle');
    setVehicleCounts({ twoWheelers: 0, threeWheelers: 0, fourWheelers: 0, heavyVehicles: 0 });
    setAnalysisResult(null);
    setRecordedData([]);
    form.reset();
  }
  
  const handleExportPdf = async () => {
    if (!chartRef.current || recordedData.length === 0 || !analysisResult) {
        toast({ variant: 'destructive', title: 'Report content not available.', description: 'Please complete a survey to generate a report.' });
        return;
    }
    setIsPdfLoading(true);
  
    try {
        const doc = new jsPDF();
        const chartImage = await toPng(chartRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: 'white' });
  
        // Title
        doc.setFontSize(20);
        doc.text("Traffic Analysis Report", 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });
  
        // Chart
        doc.setFontSize(16);
        doc.text("Vehicle Distribution", 14, 45);
        const imgProps = doc.getImageProperties(chartImage);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imgWidth = pdfWidth - 28;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        doc.addImage(chartImage, 'PNG', 14, 50, imgWidth, imgHeight);
        let yPos = 50 + imgHeight + 10;
  
        // AI Analysis & Precautions
        doc.setFontSize(16);
        doc.text("AI Analysis & Precautions", 14, yPos);
        yPos += 8;
        doc.setFontSize(12);
        doc.text("Conclusion:", 14, yPos);
        yPos += 7;
        let splitText = doc.splitTextToSize(analysisResult.analysis.conclusion, pdfWidth - 28);
        doc.setFontSize(10);
        doc.text(splitText, 14, yPos);
        yPos += (splitText.length * 5) + 5;
  
        doc.setFontSize(12);
        doc.text("Precautions:", 14, yPos);
        yPos += 7;
        splitText = doc.splitTextToSize(analysisResult.analysis.precautions, pdfWidth - 28);
        doc.setFontSize(10);
        doc.text(splitText, 14, yPos);
        yPos += (splitText.length * 5) + 10;
  
        // AI Development Suggestions
        doc.setFontSize(16);
        doc.text("Development Suggestions", 14, yPos);
        yPos += 8;
        splitText = doc.splitTextToSize(analysisResult.improvements.suggestions, pdfWidth - 28);
        doc.setFontSize(10);
        doc.text(splitText, 14, yPos);
        yPos += (splitText.length * 5) + 10;
  
        // Data Table
        (doc as any).autoTable({
            head: [['Interval', '2W', '3W', '4W', 'Heavy', 'Jams', 'Delays', 'Wrong Dir.', 'Locality', 'Cause']],
            body: recordedData.map(d => [d.timeInterval, d.twoWheelers, d.threeWheelers, d.fourWheelers, d.heavyVehicles, d.jams, d.delays, d.wrongDirection, d.locality, d.congestionCause]),
            startY: yPos,
            headStyles: { fillColor: [41, 128, 185] }, // A blue shade for header
            didDrawPage: (data) => {
              // Footer with page numbers
              doc.setFontSize(10);
              doc.text(`Page ${doc.internal.pages.length-1}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
            }
        });
  
        doc.save('traffic-analysis-report.pdf');
  
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
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1">
                <TrafficDetailsForm form={form} onSubmit={handleDetailsSubmit} isLoading={isLoading} />
            </div>
            <div className="md:col-span-2 space-y-8">
              <div className="bg-card p-2 rounded-lg shadow-md"><TrafficChart data={chartData} /></div>
              <TrafficAnalysis analysisResult={analysisResult} isLoading={isLoading} />
            </div>
          </div>
        );
      case 'analyzing':
      case 'complete':
        return (
           <div className="space-y-8">
            <Card>
                <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                     <div className="text-center sm:text-left flex-1">
                        <h3 className="text-lg font-semibold">Survey Complete!</h3>
                        <p className="text-sm text-muted-foreground">Your report is ready below. You can start a new survey or download your results.</p>
                     </div>
                     <div className="flex flex-wrap items-center justify-center gap-2">
                        <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto"><Redo className="mr-2" /> New Survey</Button>
                        <Button onClick={handleExportPdf} disabled={isPdfLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                          {isPdfLoading ? <LoaderCircle className="mr-2 animate-spin" /> : <Download className="mr-2" />}
                          Download PDF
                        </Button>
                     </div>
                </CardContent>
            </Card>

            <div ref={reportSectionRef} className="space-y-6">
                <div className="text-center pb-4 border-b">
                    <h2 className="font-headline text-3xl font-bold text-primary">Traffic Analysis Report</h2>
                    <p className="text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        <div ref={chartRef} className="bg-card p-2 rounded-lg shadow-md border"><TrafficChart data={chartData} /></div>
                        <TrafficAnalysis analysisResult={analysisResult} isLoading={isLoading} />
                    </div>
                    
                    <div className="lg:col-span-3">
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
