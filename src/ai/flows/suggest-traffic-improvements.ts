'use server';
/**
 * @fileOverview AI agent that suggests traffic improvements based on traffic analysis and user inputs.
 *
 * - suggestTrafficImprovements - A function that suggests traffic improvements.
 * - SuggestTrafficImprovementsInput - The input type for the suggestTrafficImprovements function.
 * - SuggestTrafficImprovementsOutput - The return type for the suggestTrafficImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RatingEnum = z.enum(['Less', 'Moderate', 'Normal', 'High']);

const SuggestTrafficImprovementsInputSchema = z.object({
  trafficAnalysis: z
    .string()
    .describe('The analysis of the traffic flow at certain times.'),
  humanFlow: RatingEnum.describe('The rated level of human flow in the area.'),
  jams: RatingEnum.describe('The rated level of traffic jams experienced.'),
  delays: RatingEnum.describe('The rated level of traffic delays experienced.'),
  signals: RatingEnum.describe('The rated level of issues with traffic signals in the area.'),
  wrongDirection: RatingEnum.describe('The rated level of vehicles traveling in the wrong direction.'),
});
export type SuggestTrafficImprovementsInput = z.infer<
  typeof SuggestTrafficImprovementsInputSchema
>;

const SuggestTrafficImprovementsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('Suggestions for traffic improvements, such as lane and road adjustments. Base suggestions on the ratings provided; for example, if humanFlow is high, suggest skywalks or pedestrian bridges.'),
});
export type SuggestTrafficImprovementsOutput = z.infer<
  typeof SuggestTrafficImprovementsOutputSchema
>;

export async function suggestTrafficImprovements(
  input: SuggestTrafficImprovementsInput
): Promise<SuggestTrafficImprovementsOutput> {
  return suggestTrafficImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTrafficImprovementsPrompt',
  input: {schema: SuggestTrafficImprovementsInputSchema},
  output: {schema: SuggestTrafficImprovementsOutputSchema},
  prompt: `You are an expert traffic planner. Based on the following information, suggest a list of specific infrastructure and policy development ideas to improve long-term traffic flow and safety. Include suggestions like new skywalks, road widening, signal optimization, enforcement changes, or other relevant solutions. Your suggestions should directly address the problems indicated by the ratings. For example, high ratings for 'humanFlow' and 'jams' might warrant a skywalk and intersection redesign.

Traffic Analysis: {{{trafficAnalysis}}}
Human Flow Rating: {{{humanFlow}}}
Jams Rating: {{{jams}}}
Delays Rating: {{{delays}}}
Signals Rating: {{{signals}}}
Wrong Direction Driving Rating: {{{wrongDirection}}}`,
});

const suggestTrafficImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestTrafficImprovementsFlow',
    inputSchema: SuggestTrafficImprovementsInputSchema,
    outputSchema: SuggestTrafficImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
