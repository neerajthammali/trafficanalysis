'use server';

import { analyzeTrafficData } from '@/ai/flows/analyze-traffic-data';
import { suggestTrafficImprovements } from '@/ai/flows/suggest-traffic-improvements';
import type { TrafficData } from '@/lib/types';

export async function getTrafficInsights(data: TrafficData) {
  const analysisResult = await analyzeTrafficData(data);
  
  const improvementSuggestions = await suggestTrafficImprovements({
    trafficAnalysis: analysisResult.conclusion,
    humanFlow: data.humanFlow,
    jams: data.jams,
    delays: data.delays,
    signals: data.signals,
    wrongDirection: data.wrongDirection,
    locality: data.locality,
    congestionCause: data.congestionCause,
  });

  return {
    analysis: analysisResult,
    improvements: improvementSuggestions,
  };
}
