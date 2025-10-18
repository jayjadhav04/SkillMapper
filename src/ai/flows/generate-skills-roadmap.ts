'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a skills roadmap based on user input.
 *
 * It includes:
 * - generateSkillsRoadmap: The main function to generate the skills roadmap.
 * - GenerateSkillsRoadmapInput: The input type for the generateSkillsRoadmap function.
 * - GenerateSkillsRoadmapOutput: The output type for the generateSkillsRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSkillsRoadmapInputSchema = z.object({
  currentSkills: z
    .string()
    .describe('A comma separated list of the user\'s current skills.'),
  careerGoals: z.string().describe('The career goals of the user.'),
});
export type GenerateSkillsRoadmapInput = z.infer<
  typeof GenerateSkillsRoadmapInputSchema
>;

const SkillSchema = z.object({
  skillName: z.string().describe('The name of the skill to learn.'),
  learningResources: z
    .string()
    .describe('A comma separated list of URLs to learning resources for the skill.'),
});

const GenerateSkillsRoadmapOutputSchema = z.object({
  skillsRoadmap: z.array(SkillSchema).describe(
    'An array of the next 3-5 skills the user should learn, with learning resources for each skill.'
  ),
});

export type GenerateSkillsRoadmapOutput = z.infer<
  typeof GenerateSkillsRoadmapOutputSchema
>;

export async function generateSkillsRoadmap(
  input: GenerateSkillsRoadmapInput
): Promise<GenerateSkillsRoadmapOutput> {
  return generateSkillsRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSkillsRoadmapPrompt',
  input: {schema: GenerateSkillsRoadmapInputSchema},
  output: {schema: GenerateSkillsRoadmapOutputSchema},
  prompt: `You are a career advisor who specializes in creating personalized learning roadmaps.

  Based on the user's current skills and career goals, you will generate a roadmap of the next 3-5 skills they should learn.

  Current Skills: {{{currentSkills}}}
  Career Goals: {{{careerGoals}}}

  Skills Roadmap:`,
});

const generateSkillsRoadmapFlow = ai.defineFlow(
  {
    name: 'generateSkillsRoadmapFlow',
    inputSchema: GenerateSkillsRoadmapInputSchema,
    outputSchema: GenerateSkillsRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
