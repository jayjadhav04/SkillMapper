
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, GraduationCap, BookOpen, CheckCircle2, ChevronRight, Goal, Download, Loader, Lightbulb } from 'lucide-react';
import type { GenerateSkillsRoadmapOutput } from '@/ai/flows/generate-skills-roadmap';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface RoadmapDisplayProps {
  roadmap: GenerateSkillsRoadmapOutput;
}

const parseResources = (resources: string) => {
  return resources.split(',').map(link => link.trim()).filter(link => link);
}

function RoadmapStep({ skill, index, total, isOpen, onToggle }: { skill: GenerateSkillsRoadmapOutput['skillsRoadmap'][0], index: number, total: number, isOpen: boolean, onToggle: () => void }) {
  return (
    <div className="relative pl-8 sm:pl-12 py-6 group">
      {/* Vertical line */}
      <div className={cn(
        "absolute top-0 left-4 sm:left-6 w-px h-full bg-border",
        index === 0 && "top-6",
        index === total - 1 && "h-6"
      )}></div>
      
      {/* Step circle */}
      <div className={cn(
        "absolute top-6 left-[-1px] sm:left-1.5 flex items-center justify-center w-10 h-10 rounded-full bg-card border-2 font-bold text-lg",
        isOpen ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border"
      )}>
        {index + 1}
      </div>

      <Card 
        className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? 'bg-card/80' : 'bg-card'
        )}
      >
        <button onClick={onToggle} className="w-full text-left p-4 sm:p-6 cursor-pointer hover:bg-secondary/50 transition-colors">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold text-card-foreground">{skill.skillName}</h3>
              <p className="text-sm text-muted-foreground mt-1">{skill.skillDescription}</p>
            </div>
            <ChevronRight className={cn("ml-auto h-5 w-5 text-muted-foreground transition-transform", isOpen && 'rotate-90')} />
          </div>
        </button>

        {isOpen && (
            <div className="p-4 sm:p-6 border-t border-border space-y-8">
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
          </div>
        )}
      </Card>
    </div>
  );
}

export function RoadmapDisplay({ roadmap }: RoadmapDisplayProps) {
  const [openStep, setOpenStep] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenStep(openStep === index ? null : index);
  };
  
  const handleDownload = () => {
    let content = "Your Personalized Learning Roadmap\n\n";

    roadmap.skillsRoadmap.forEach((skill, index) => {
      content += `Step ${index + 1}: ${skill.skillName}\n`;
      content += `Description: ${skill.skillDescription}\n\n`;
      content += "Learning Plan:\n";
      skill.learningSteps.forEach((step, stepIndex) => {
        content += `  ${stepIndex + 1}. ${step}\n`;
      });
      content += "\nLearning Resources:\n";
      parseResources(skill.learningResources).forEach(resource => {
        content += `  - ${resource}\n`;
      });
      content += "\n--------------------------------------------------\n\n";
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skill-roadmap.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <GraduationCap className="h-7 w-7 text-primary" />
          Your Personalized Learning Roadmap
        </CardTitle>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div>
          {roadmap.skillsRoadmap.map((skill, index) => (
            <RoadmapStep 
              key={index} 
              skill={skill} 
              index={index} 
              total={roadmap.skillsRoadmap.length}
              isOpen={openStep === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const quotes = [
    "The beautiful thing about learning is that nobody can take it away from you.",
    "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    "The expert in anything was once a beginner.",
    "An investment in knowledge pays the best interest.",
    "The only way to do great work is to love what you do.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It does not matter how slowly you go as long as you do not stop.",
    "The journey of a thousand miles begins with a single step.",
];

export function RoadmapSkeleton() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center text-center p-8 rounded-lg bg-card/50 border-border/50">
        <div className="relative mb-6">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <Lightbulb className="h-8 w-8 text-primary" />
            </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Crafting your learning path...</h3>
        <p className="text-muted-foreground max-w-md">
            &ldquo;{quote}&rdquo;
        </p>
    </div>
  );
}
