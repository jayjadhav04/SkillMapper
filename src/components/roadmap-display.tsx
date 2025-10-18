
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, GraduationCap, BookOpen, CheckCircle2, ChevronRight, Goal } from 'lucide-react';
import type { GenerateSkillsRoadmapOutput } from '@/ai/flows/generate-skills-roadmap';

interface RoadmapDisplayProps {
  roadmap: GenerateSkillsRoadmapOutput;
}

export function RoadmapDisplay({ roadmap }: RoadmapDisplayProps) {

  const parseResources = (resources: string) => {
    return resources.split(',').map(link => link.trim()).filter(link => link);
  }

  return (
    <Card className="w-full bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <GraduationCap className="h-7 w-7 text-primary" />
          Your Personalized Learning Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {roadmap.skillsRoadmap.map((skill, index) => (
            <Card key={index} className="overflow-hidden">
               <Accordion type="single" collapsible>
                <AccordionItem value={`item-${index}`} className="border-b-0">
                  <AccordionTrigger className="p-6 hover:no-underline bg-card hover:bg-secondary/50">
                    <div className="flex items-center gap-4 text-left">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-card-foreground">{skill.skillName}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{skill.skillDescription}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-6 space-y-8 bg-card/80">
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-4 flex items-center gap-2 text-lg">
                        <Goal className="h-5 w-5 text-accent" />
                        Step-by-Step Learning Plan
                      </h4>
                      <div className="space-y-4">
                        {skill.learningSteps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                            <p className="text-card-foreground/90">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-card-foreground mb-4 flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-accent" />
                        Learning Resources
                      </h4>
                      <ul className="space-y-3">
                        {parseResources(skill.learningResources).map((resource, resIndex) => (
                          <li key={resIndex}>
                            <a
                              href={resource}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-primary hover:underline underline-offset-4 transition-colors group"
                            >
                              <Link className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{resource}</span>
                              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RoadmapSkeleton() {
  return (
    <Card className="w-full bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-7 w-1/2" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-grow">
                   <Skeleton className="h-6 w-1/3" />
                   <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
