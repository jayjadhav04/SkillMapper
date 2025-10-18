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
  skillDescription: z
    .string()
    .describe(
      'A short summary of why this skill is important for the user\'s career goals.'
    ),
  learningSteps: z.array(z.string()).describe('A step-by-step plan of what to study to learn this skill, from fundamentals to more advanced topics. Each step should be a concise action item.'),
  learningResources: z
    .string()
    .describe('A comma separated list of URLs to learning resources for the skill.'),
});

const GenerateSkillsRoadmapOutputSchema = z.object({
  skillsRoadmap: z.array(SkillSchema).describe(
    'An array containing the next single skill the user should learn to achieve their career goals. This array must contain exactly one skill.'
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
  prompt: `You are a career advisor who specializes in creating personalized learning roadmaps. Your goal is to provide a clear, simple, and easy-to-understand plan.

  Based on the user's current skills and career goals, you will generate a roadmap for the **single most important skill** they should learn next. The output must contain a roadmap for ONLY ONE skill.

  For this single skill, provide:
  1. A short summary of why it's the most critical next step for the user's career goals.
  2. A detailed, step-by-step plan of what to study. Start with the absolute basics and progress to more advanced concepts. Each step must be a clear, actionable instruction.
  3. A list of comma-separated URLs for high-quality learning resources.

  Current Skills: {{{currentSkills}}}
  Career Goals: {{{careerGoals}}}

  Generate the roadmap for the next skill:`,
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
