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
const LocalityEnum = z.enum(['Residential', 'Commercial', 'Industrial', 'Mixed-use']);
const CongestionCauseEnum = z.enum(['Peak Hour Rush', 'Road Work', 'Accident', 'Special Event', 'None']);


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
  locality: LocalityEnum.describe('The type of road locality.'),
  congestionCause: CongestionCauseEnum.describe('The primary cause of congestion.'),
  remarks: z.string().optional().describe('Additional remarks from the user about road conditions or other factors.'),
});
export type AnalyzeTrafficDataInput = z.infer<typeof AnalyzeTrafficDataInputSchema>;

const AnalyzeTrafficDataOutputSchema = z.object({
  conclusion: z.string().describe('A short, snappy conclusion about the traffic flow. Easy to read!'),
  precautions: z.string().describe('A simple, scannable list of safety tips.'),
});
export type AnalyzeTrafficDataOutput = z.infer<typeof AnalyzeTrafficDataOutputSchema>;

export async function analyzeTrafficData(input: AnalyzeTrafficDataInput): Promise<AnalyzeTrafficDataOutput> {
  return analyzeTrafficDataFlow(input);
}

const analyzeTrafficDataPrompt = ai.definePrompt({
  name: 'analyzeTrafficDataPrompt',
  input: {schema: AnalyzeTrafficDataInputSchema},
  output: {schema: AnalyzeTrafficDataOutputSchema},
  prompt: `You are a friendly and helpful traffic analyst. Your goal is to provide a simple, easy-to-understand summary of traffic conditions. Use short sentences and a positive tone.

Here is the traffic data you need to analyze:
- Two-wheelers: {{{twoWheelers}}}
- Three-wheelers: {{{threeWheelers}}}
- Four-wheelers: {{{fourWheelers}}}
- Heavy Vehicles: {{{heavyVehicles}}}

Observation Details:
- Time Interval: {{{timeInterval}}}
- Time of Day: {{{trafficTime}}}
- Locality: {{{locality}}}
- Human Flow: {{{humanFlow}}}
- Traffic Jams: {{{jams}}}
- Delays: {{{delays}}}
- Signal Issues: {{{signals}}}
- Wrong-Way Drivers: {{{wrongDirection}}}
- Main Cause of Congestion: {{{congestionCause}}}
{{#if remarks}}
- Observer's Remarks: {{{remarks}}}
{{/if}}

Based on this complete dataset, please provide two things in simple, clear language. Each response should be between 50 and 150 words.
1.  **Conclusion:** Summarize the overall traffic situation. Is it busy? Which type of vehicle is most common? Keep it concise and easy to read.
2.  **Precautions:** What are some quick safety tips for people in this area right now? Use bullet points or a short list for easy scanning.`,
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
