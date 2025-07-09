import { z } from 'zod';
import type { AnalyzeTrafficDataOutput } from '@/ai/flows/analyze-traffic-data';
import type { SuggestTrafficImprovementsOutput } from '@/ai/flows/suggest-traffic-improvements';

export const TrafficDataSchema = z.object({
  twoWheelers: z.coerce.number().int().min(0, "Count cannot be negative").default(0),
  threeWheelers: z.coerce.number().int().min(0, "Count cannot be negative").default(0),
  fourWheelers: z.coerce.number().int().min(0, "Count cannot be negative").default(0),
  heavyVehicles: z.coerce.number().int().min(0, "Count cannot be negative").default(0),
  timeInterval: z.enum(['1 hour', '30 mins'], { required_error: "Please select a time interval."}),
  trafficTime: z.enum(['Peak Time', 'Normal Time'], { required_error: "Please select a traffic time."}),
  humanFlow: z.string().min(3, 'Please describe the human flow.'),
  jams: z.string().min(3, 'Please describe any traffic jams.'),
  delays: z.string().min(3, 'Please describe any delays.'),
  signals: z.string().min(3, 'Please describe the traffic signal situation.'),
});

export type TrafficData = z.infer<typeof TrafficDataSchema>;

export type RecordedTrafficData = TrafficData & { id: string };

export type AnalysisResult = {
    analysis: AnalyzeTrafficDataOutput,
    improvements: SuggestTrafficImprovementsOutput
}
