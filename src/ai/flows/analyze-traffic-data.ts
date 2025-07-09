'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing traffic data and providing insights.
 *
 * analyzeTrafficData - Analyzes traffic data and provides a conclusion about traffic flow.
 * AnalyzeTrafficDataInput - The input type for the analyzeTrafficData function.
 * AnalyzeTrafficDataOutput - The return type for the analyzeTrafficData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTrafficDataInputSchema = z.object({
  twoWheelers: z.number().describe('Number of two-wheeled vehicles.'),
  threeWheelers: z.number().describe('Number of three-wheeled vehicles.'),
  fourWheelers: z.number().describe('Number of four-wheeled vehicles.'),
  heavyVehicles: z.number().describe('Number of heavy vehicles.'),
  timeInterval: z.string().describe('The time interval for the data (e.g., 1 hour, 30 mins).'),
  trafficTime: z.string().describe('The time of day for the traffic data (e.g., peak time, normal time).'),
  humanFlow: z.string().describe('Information about human flow'),
  jams: z.string().describe('Information about traffic jams'),
  delays: z.string().describe('Information about traffic delays'),
  signals: z.string().describe('Information about traffic signals'),
});
export type AnalyzeTrafficDataInput = z.infer<typeof AnalyzeTrafficDataInputSchema>;

const AnalyzeTrafficDataOutputSchema = z.object({
  conclusion: z.string().describe('A short conclusion about the traffic flow at the specified time.'),
  recommendations: z.string().describe('Suggestions for traffic improvement based on the analysis.'),
});
export type AnalyzeTrafficDataOutput = z.infer<typeof AnalyzeTrafficDataOutputSchema>;

export async function analyzeTrafficData(input: AnalyzeTrafficDataInput): Promise<AnalyzeTrafficDataOutput> {
  return analyzeTrafficDataFlow(input);
}

const analyzeTrafficDataPrompt = ai.definePrompt({
  name: 'analyzeTrafficDataPrompt',
  input: {schema: AnalyzeTrafficDataInputSchema},
  output: {schema: AnalyzeTrafficDataOutputSchema},
  prompt: `You are an expert traffic analyst. Analyze the following traffic data and provide a short conclusion about the traffic flow at the specified time, and provide traffic improvement suggestions based on your analysis.

Vehicle Counts:
- Two-wheelers: {{{twoWheelers}}}
- Three-wheelers: {{{threeWheelers}}}
- Four-wheelers: {{{fourWheelers}}}
- Heavy vehicles: {{{heavyVehicles}}}

Time Interval: {{{timeInterval}}}
Traffic Time: {{{trafficTime}}}

Additional Information:
- Human flow: {{{humanFlow}}}
- Jams: {{{jams}}}
- Delays: {{{delays}}}
- Signals: {{{signals}}}

Conclusion:
{{{conclusion}}}

Recommendations:
{{{recommendations}}}`,
});

const analyzeTrafficDataFlow = ai.defineFlow(
  {
    name: 'analyzeTrafficDataFlow',
    inputSchema: AnalyzeTrafficDataInputSchema,
    outputSchema: AnalyzeTrafficDataOutputSchema,
  },
  async input => {
    const {output} = await analyzeTrafficDataPrompt(input);
    return output!;
  }
);
