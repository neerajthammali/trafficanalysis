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
  prompt: `You're a friendly traffic helper! Let's look at the cars and people. Be fun and easy to understand. Use short sentences!

Here's what we saw:
- Lots of two-wheelers! ({{{twoWheelers}}})
- Three-wheelers zooming by. ({{{threeWheelers}}})
- Cars, cars, cars! ({{{fourWheelers}}})
- Big trucks rolling through. ({{{heavyVehicles}}})

This was for {{{timeInterval}}} during {{{trafficTime}}}.

And here's what it felt like:
- People walking around: {{{humanFlow}}}
- Cars stuck in jams: {{{jams}}}
- Waiting and delays: {{{delays}}}
- Traffic lights helping (or not!): {{{signals}}}
- Oops! Cars going the wrong way: {{{wrongDirection}}}

Now, tell me two things in simple words:
1.  **Conclusion:** What's the main traffic story? Is it super busy? Which vehicle is the king of the road right now? Keep it short and snappy!
2.  **Precautions:** Quick safety tips! What should people watch out for right now? Use bullet points or a short list.`,
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