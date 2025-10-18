
'use server';

import {
  generateSkillsRoadmap,
  type GenerateSkillsRoadmapInput,
} from '@/ai/flows/generate-skills-roadmap';
import { run } from '@genkit-ai/next/server';

export async function getSkillsRoadmap(
  input: GenerateSkillsRoadmapInput
) {
  return run(generateSkillsRoadmap, input);
}
