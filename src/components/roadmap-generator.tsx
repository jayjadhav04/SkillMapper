
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Sparkles, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RoadmapDisplay, RoadmapSkeleton } from '@/components/roadmap-display';
import { getSkillsRoadmap } from '@/app/actions';
import type { GenerateSkillsRoadmapOutput } from '@/ai/flows/generate-skills-roadmap';

const formSchema = z.object({
  currentSkills: z.string().min(5, {
    message: 'Please list at least one skill.',
  }).describe('A comma separated list of the user\'s current skills.'),
  careerGoals: z.string().min(10, {
    message: 'Your career goals must be at least 10 characters.',
  }).describe('The career goals of the user.'),
});

export function RoadmapGenerator() {
  const [roadmap, setRoadmap] = useState<GenerateSkillsRoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentSkills: '',
      careerGoals: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRoadmap(null);
    setError(null);

    try {
      const result = await getSkillsRoadmap(values);
      if (!result || !result.skillsRoadmap || result.skillsRoadmap.length === 0) {
        setError('Could not generate a roadmap. Try adjusting your input.');
      } else {
        setRoadmap(result);
      }
    } catch (e: any) {
        setError(e.message || 'An unexpected error occurred. Please try again later.');
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="currentSkills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Your Current Skills</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Python, HTML, Communication"
                          className="min-h-[120px] resize-y text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        List skills you are comfortable with, separated by commas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="careerGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Your Career Goals</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Become a full-stack web developer specializing in AI applications."
                          className="min-h-[120px] resize-y text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe where you want to be in your career.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto transform transition-transform hover:scale-105 active:scale-100">
                  <Sparkles className={`mr-2 h-5 w-5 ${isLoading ? 'animate-spin' : 'group-hover:animate-pulse'}`} />
                  {isLoading ? 'Charting Your Course...' : 'Chart My Course'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mt-4">
        {isLoading && <RoadmapSkeleton />}
        {error && (
           <Alert variant="destructive">
             <AlertCircle className="h-4 w-4" />
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>{error}</AlertDescription>
           </Alert>
        )}
        {roadmap && <RoadmapDisplay roadmap={roadmap} />}
      </div>
    </div>
  );
}
