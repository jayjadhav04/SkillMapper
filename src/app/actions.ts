
'use server';

import {
  generateSkillsRoadmap,
  type GenerateSkillsRoadmapInput,
  type GenerateSkillsRoadmapOutput,
} from '@/ai/flows/generate-skills-roadmap';

export async function getSkillsRoadmap(
  input: GenerateSkillsRoadmapInput
): Promise<{ data: GenerateSkillsRoadmapOutput | null; error: string | null }> {
  try {
    const result = await generateSkillsRoadmap(input);
    if (!result || !result.skillsRoadmap || result.skillsRoadmap.length === 0) {
      return {
        data: null,
        error: 'Could not generate a roadmap. Try adjusting your input.',
      };
    }
    return { data: result, error: null };
  } catch (e) {
    console.error('Roadmap generation failed:', e);
    return {
      data: null,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
