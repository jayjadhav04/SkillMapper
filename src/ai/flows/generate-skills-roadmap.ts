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
  requiredSkills: z
    .array(z.string())
    .describe(
      'A list of prerequisite skills the user should be familiar with before starting.'
    ),
  importantLibraries: z
    .array(z.string())
    .describe(
      'A list of important libraries, frameworks, or tools related to this skill.'
    ),
  learningSteps: z
    .array(z.string())
    .describe(
      'A step-by-step plan of what to study to learn this skill, from fundamentals to more advanced topics. Each step should be a concise action item.'
    ),
  learningResources: z
    .string()
    .describe('A comma separated list of URLs to learning resources for the skill.'),
});

const GenerateSkillsRoadmapOutputSchema = z.object({
  skillsRoadmap: z.array(SkillSchema).describe(
    'An array of skills the user should learn to achieve their career goals, ordered by priority.'
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
  config: {
    temperature: 0,
  },
  prompt: `You are a career advisor who specializes in creating personalized learning roadmaps. Your goal is to provide a clear, simple, and easy-to-understand plan.

  Based on the user's current skills and career goals, you will generate a roadmap of the most important skills they should learn next, in a logical order.

  For each skill, provide:
  1. A short summary of why it's a critical step for the user's career goals.
  2. A list of prerequisite skills needed before starting this skill.
  3. A list of important libraries, frameworks, or tools to focus on.
  4. A detailed, step-by-step plan of what to study. Start with the absolute basics and progress to more advanced concepts. Each step must be a clear, actionable instruction.
  5. A list of comma-separated URLs for high-quality learning resources.

  Current Skills: {{{currentSkills}}}
  Career Goals: {{{careerGoals}}}

  Generate the roadmap:`,
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
