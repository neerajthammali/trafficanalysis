import { z } from 'zod';
import type { AnalyzeTrafficDataOutput } from '@/ai/flows/analyze-traffic-data';
import type { SuggestTrafficImprovementsOutput } from '@/ai/flows/suggest-traffic-improvements';

const RatingEnum = z.enum(['Less', 'Moderate', 'Normal', 'High'], { required_error: "Please select a rating."});

export const TrafficDataSchema = z.object({
  twoWheelers: z.coerce.number().int().min(0).default(0),
  threeWheelers: z.coerce.number().int().min(0).default(0),
  fourWheelers: z.coerce.number().int().min(0).default(0),
  heavyVehicles: z.coerce.number().int().min(0).default(0),
  timeInterval: z.string(),
  trafficTime: z.string(),
  humanFlow: RatingEnum,
  jams: RatingEnum,
  delays: RatingEnum,
  signals: RatingEnum,
  wrongDirection: RatingEnum,
});

export const TrafficDetailsSchema = TrafficDataSchema.pick({
  humanFlow: true,
  jams: true,
  delays: true,
  signals: true,
  wrongDirection: true,
});
export type TrafficDetailsData = z.infer<typeof TrafficDetailsSchema>;

export type TrafficData = z.infer<typeof TrafficDataSchema>;

export type RecordedTrafficData = TrafficData & { id: string };

export type VehicleChartData = {
  name: string;
  value: number;
  fill: string;
}

export type AnalysisResult = {
    analysis: AnalyzeTrafficDataOutput,
    improvements: SuggestTrafficImprovementsOutput
}
