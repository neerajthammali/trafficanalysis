'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What is the Traffic Analyzer?",
    answer: "It's a tool to help you analyze traffic in your area. You can count different types of vehicles, record your observations about traffic conditions, and get AI-powered suggestions to improve traffic flow."
  },
  {
    question: "How does the AI analysis work?",
    answer: "The app uses Google's Gemini AI model through Genkit. You provide data about vehicle counts and traffic conditions (like jams or delays). The AI then analyzes this data to give you a simple conclusion, safety tips, and ideas for development like new flyovers or wider roads."
  },
  {
    question: "What technologies does this app use?",
    answer: "This application is built with modern web technologies. The frontend is built with Next.js and React, styled with Tailwind CSS and ShadCN UI components. The AI capabilities are powered by Google's Genkit."
  },
  {
    question: "How do I use the Traffic Analyzer?",
    answer: "It's a simple 3-step process: 1. Set Timer: Decide how long you want to observe the traffic. 2. Count Vehicles: Use the counters to tally vehicles as they pass. 3. Add Observations: Rate factors like pedestrian flow and traffic jams. Once you're done, the AI will generate a detailed report which you can export as a PDF."
  },
  {
    question: "Is my data saved?",
    answer: "The data you enter is stored only for your current session in your browser. When you close or refresh the page, the data is cleared. The survey history table shows you the data from your current session only."
  }
]

export function Faq() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            Frequently Asked Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index}>
              <AccordionTrigger>
                <div className="flex items-center gap-2 font-semibold text-left">
                  {faq.question}
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
