
'use server';

import {
  generateSkillsRoadmap,
  type GenerateSkillsRoadmapInput,
} from '@/ai/flows/generate-skills-roadmap';

export async function getSkillsRoadmap(
  input: GenerateSkillsRoadmapInput
) {
  return generateSkillsRoadmap(input);
}
