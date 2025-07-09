'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ShieldCheck, Wrench, Siren } from 'lucide-react';

export function TrafficInfo() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Traffic Engineering Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-5 w-5 text-primary" />
                IS Standards & Precautions
              </div>
            </AccordionTrigger>
            <AccordionContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                Traffic engineering in India follows various Indian Road Congress (IRC) standards. Key considerations include roadway geometry, intersection design, traffic signal timing, and pedestrian facilities.
              </p>
              <p>
                <strong>Precautions:</strong> Always ensure proper signage, road markings, and lighting, especially at intersections and construction zones. Regular maintenance of traffic control devices is crucial for safety and efficiency.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <div className="flex items-center gap-2 font-semibold">
                <Wrench className="h-5 w-5 text-accent" />
                Development Needs
              </div>
            </AccordionTrigger>
            <AccordionContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                Future development should focus on sustainable transport solutions like dedicated bus lanes, cycling tracks, and pedestrian-friendly infrastructure. Integrating smart traffic management systems using IoT and AI can optimize flow and reduce congestion.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <div className="flex items-center gap-2 font-semibold">
                <Siren className="h-5 w-5 text-destructive" />
                Common Errors & Mitigation
              </div>
            </AccordionTrigger>
            <AccordionContent className="prose prose-sm dark:prose-invert max-w-none">
              <p>
                <strong>Common Errors:</strong> Poorly timed signals, inadequate lane width, lack of pedestrian crossings, and insufficient parking are common issues.
              </p>
              <p>
                <strong>Mitigation:</strong> Conduct regular traffic studies, use simulation models to test changes before implementation, and engage with the community to gather feedback. Data-driven decision making is key to avoiding these errors.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
