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
const LocalityEnum = z.enum(['Residential', 'Commercial', 'Industrial', 'Mixed-use']);
const CongestionCauseEnum = z.enum(['Peak Hour Rush', 'Road Work', 'Accident', 'Special Event', 'None']);

const SuggestTrafficImprovementsInputSchema = z.object({
  trafficAnalysis: z
    .string()
    .describe('The analysis of the traffic flow at certain times.'),
  humanFlow: RatingEnum.describe('The rated level of human flow in the area.'),
  jams: RatingEnum.describe('The rated level of traffic jams experienced.'),
  delays: RatingEnum.describe('The rated level of traffic delays experienced.'),
  signals: RatingEnum.describe('The rated level of issues with traffic signals in the area.'),
  wrongDirection: RatingEnum.describe('The rated level of vehicles traveling in the wrong direction.'),
  locality: LocalityEnum.describe('The type of road locality.'),
  congestionCause: CongestionCauseEnum.describe('The primary cause of congestion.'),
  remarks: z.string().optional().describe('Additional remarks from the user.'),
});
export type SuggestTrafficImprovementsInput = z.infer<
  typeof SuggestTrafficImprovementsInputSchema
>;

const SuggestTrafficImprovementsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('A simple, scannable list of cool ideas to improve traffic, like skywalks or wider roads. Fun and easy to read!'),
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
  prompt: `You're a super city planner! Your job is to make traffic better for everyone. Use simple words and short ideas. The entire response should be between 50 and 150 words.

Here's the situation: {{{trafficAnalysis}}}
This is in a {{{locality}}} area.

And here are the trouble spots:
- People traffic: {{{humanFlow}}}
- Car Jams: {{{jams}}}
- Annoying Delays: {{{delays}}}
- Mixed-up Signals: {{{signals}}}
- Wrong Way Drivers: {{{wrongDirection}}}
- Main Cause: {{{congestionCause}}}
{{#if remarks}}
- Other notes from the observer: {{{remarks}}}
{{/if}}

Based on this, give some cool ideas to fix things for the future!
Make your suggestions a simple, scannable list.
If 'humanFlow' is high, maybe suggest a skywalk. If 'jams' are high, maybe suggest making the road bigger. If 'congestionCause' is 'Road Work', suggest better planning for construction. If 'locality' is 'Commercial', suggest better parking. If 'remarks' mentions things like 'potholes' or 'bad road', suggest road repair. Be direct and use easy-to-read language.`,
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
