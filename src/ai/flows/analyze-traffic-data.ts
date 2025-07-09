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

const RatingEnum = z.enum(['Less', 'Moderate', 'Normal', 'High']);

const AnalyzeTrafficDataInputSchema = z.object({
  twoWheelers: z.number().describe('Number of two-wheeled vehicles.'),
  threeWheelers: z.number().describe('Number of three-wheeled vehicles.'),
  fourWheelers: z.number().describe('Number of four-wheeled vehicles.'),
  heavyVehicles: z.number().describe('Number of heavy vehicles.'),
  timeInterval: z.string().describe('The time interval for the data (e.g., 15 minutes).'),
  trafficTime: z.string().describe('The time of day for the traffic data (e.g., peak time, normal time).'),
  humanFlow: RatingEnum.describe('The rated level of human flow.'),
  jams: RatingEnum.describe('The rated level of traffic jams.'),
  delays: RatingEnum.describe('The rated level of traffic delays.'),
  signals: RatingEnum.describe('The rated level of issues with traffic signals.'),
  wrongDirection: RatingEnum.describe('The rated level of vehicles traveling in the wrong direction.'),
});
export type AnalyzeTrafficDataInput = z.infer<typeof AnalyzeTrafficDataInputSchema>;

const AnalyzeTrafficDataOutputSchema = z.object({
  conclusion: z.string().describe('A short conclusion about the traffic flow, congestion level, and key issues.'),
  precautions: z.string().describe('Precautions to be taken based on the analysis, focusing on immediate safety measures.'),
});
export type AnalyzeTrafficDataOutput = z.infer<typeof AnalyzeTrafficDataOutputSchema>;

export async function analyzeTrafficData(input: AnalyzeTrafficDataInput): Promise<AnalyzeTrafficDataOutput> {
  return analyzeTrafficDataFlow(input);
}

const analyzeTrafficDataPrompt = ai.definePrompt({
  name: 'analyzeTrafficDataPrompt',
  input: {schema: AnalyzeTrafficDataInputSchema},
  output: {schema: AnalyzeTrafficDataOutputSchema},
  prompt: `You are an expert traffic analyst. Analyze the following traffic data:

Vehicle Counts:
- Two-wheelers: {{{twoWheelers}}}
- Three-wheelers: {{{threeWheelers}}}
- Four-wheelers: {{{fourWheelers}}}
- Heavy vehicles: {{{heavyVehicles}}}

Time Interval: {{{timeInterval}}}
Traffic Time: {{{trafficTime}}}

Observer Ratings:
- Human flow: {{{humanFlow}}}
- Jams: {{{jams}}}
- Delays: {{{delays}}}
- Signals: {{{signals}}}
- Wrong Direction Driving: {{{wrongDirection}}}

Based on this data, provide:
1. A short conclusion about the traffic flow, congestion level, and key issues, identifying which vehicle type is dominant.
2. A list of safety precautions that should be taken immediately to mitigate risks identified from the ratings.`,
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
