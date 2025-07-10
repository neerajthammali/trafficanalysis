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
  prompt: `You are a creative city planner tasked with suggesting future development ideas to improve traffic flow. Use simple language and present your ideas clearly. The entire response should be between 50 and 150 words.

Here's the summary of the current traffic situation: {{{trafficAnalysis}}}
This is in a {{{locality}}} area.

Here are the key problem areas identified:
- Pedestrian Traffic: {{{humanFlow}}}
- Vehicle Jams: {{{jams}}}
- Travel Delays: {{{delays}}}
- Traffic Signal Performance: {{{signals}}}
- Wrong-Way Driving Incidents: {{{wrongDirection}}}
- Main Cause of Congestion: {{{congestionCause}}}
{{#if remarks}}
- Additional Notes: {{{remarks}}}
{{/if}}

Based on this information, provide a simple, scannable list of development suggestions for the future.
Be direct and logical. For example:
- If 'humanFlow' is high, suggest solutions like skywalks or wider sidewalks.
- If 'jams' are high, suggest road widening or a new flyover.
- If 'congestionCause' is 'Road Work', suggest better planning for future construction projects.
- If 'locality' is 'Commercial', suggest improved parking facilities.
- If 'remarks' mention issues like 'potholes' or 'bad road', suggest immediate road repair and maintenance.
- If 'wrongDirection' is high, suggest installing better signage or road dividers.`,
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
