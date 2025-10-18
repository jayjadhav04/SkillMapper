
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, GraduationCap } from 'lucide-react';
import type { GenerateSkillsRoadmapOutput } from '@/ai/flows/generate-skills-roadmap';

interface RoadmapDisplayProps {
  roadmap: GenerateSkillsRoadmapOutput;
}

export function RoadmapDisplay({ roadmap }: RoadmapDisplayProps) {

  const parseResources = (resources: string) => {
    return resources.split(',').map(link => link.trim()).filter(link => link);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-primary" />
          Your Personalized Learning Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
          {roadmap.skillsRoadmap.map((skill, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-4 text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-lg font-medium">{skill.skillName}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-[56px] space-y-4">
                 <p className="text-muted-foreground">{skill.skillDescription}</p>
                <div className="space-y-4">
                  <h4 className="font-semibold text-muted-foreground">Learning Resources:</h4>
                  <ul className="space-y-3">
                    {parseResources(skill.learningResources).map((resource, resIndex) => (
                      <li key={resIndex}>
                        <a
                          href={resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline underline-offset-4 transition-colors"
                        >
                          <Link className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{resource}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

export function RoadmapSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-1/2" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-grow">
                 <Skeleton className="h-5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
