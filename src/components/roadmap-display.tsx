
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, GraduationCap, BookOpen, CheckCircle2, ChevronRight, Goal, Download, Loader, Lightbulb, ListChecks, Library, TrendingUp, Shield, ShieldAlert, ArrowRight } from 'lucide-react';
import type { GenerateSkillsRoadmapOutput } from '@/ai/flows/generate-skills-roadmap';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import jsPDF from 'jspdf';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

interface RoadmapDisplayProps {
  roadmap: GenerateSkillsRoadmapOutput;
}

const parseResources = (resources: string) => {
  return resources.split(',').map(link => link.trim()).filter(link => link);
}

function FutureScopeAnalysis({ futureScope }: { futureScope: GenerateSkillsRoadmapOutput['futureScope'] }) {
  const { isSecure, analysis, alternativeGoals } = futureScope;
  const Icon = isSecure ? Shield : ShieldAlert;
  const cardBorderColor = isSecure ? 'border-green-500/30' : 'border-destructive/30';
  const iconColor = isSecure ? 'text-green-500' : 'text-destructive';

  return (
    <div className="mb-8">
      <Card className={cn("bg-card/70 border-2", cardBorderColor)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <TrendingUp className="h-6 w-6 text-primary" />
            Future Scope Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
              <div className="flex items-center gap-2 mb-4">
                  <Icon className={cn("h-5 w-5", iconColor)} />
                  <h4 className="font-semibold text-card-foreground">
                      {isSecure ? "Career Outlook: Promising" : "Career Outlook: Potential Risks"}
                  </h4>
              </div>
              <ul className="space-y-2">
                  {analysis.map((point, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{point}</span>
                      </li>
                  ))}
              </ul>
          </div>
          
          {!isSecure && alternativeGoals && alternativeGoals.length > 0 && (
            <div className="border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0 md:pl-8">
              <h4 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                Alternative Career Paths
              </h4>
              <ul className="space-y-2">
                {alternativeGoals.map((goal, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowRight className="h-4 w-4 text-accent shrink-0" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
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
        <div className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div>
                <h3 className="text-xl font-semibold text-card-foreground">{skill.skillName}</h3>
                <p className="text-sm text-muted-foreground mt-1">{skill.skillDescription}</p>
              </div>
              <button onClick={onToggle} className="ml-auto p-2 -mr-2 -mt-2 shrink-0">
                <ChevronRight className={cn("h-5 w-5 text-muted-foreground transition-transform", isOpen && 'rotate-90')} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
              <div>
                <h4 className="font-semibold text-card-foreground mb-3 flex items-center gap-2 text-md">
                  <ListChecks className="h-5 w-5 text-accent" />
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skill.requiredSkills.map((reqSkill, reqIndex) => (
                    <Badge key={reqIndex} variant="secondary">{reqSkill}</Badge>
                  ))}
                  {skill.requiredSkills.length === 0 && <p className="text-sm text-muted-foreground">None</p>}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-card-foreground mb-3 flex items-center gap-2 text-md">
                  <Library className="h-5 w-5 text-accent" />
                  Important Libraries & Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skill.importantLibraries.map((lib, libIndex) => (
                    <Badge key={libIndex} variant="secondary">{lib}</Badge>
                  ))}
                   {skill.importantLibraries.length === 0 && <p className="text-sm text-muted-foreground">None recommended for beginners</p>}
                </div>
              </div>
            </div>
        </div>

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
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleToggle = (index: number) => {
    setOpenStep(openStep === index ? null : index);
  };
  
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });
      doc.setFont('Inter', 'normal');

      // Hardcode colors for PDF to ensure visibility regardless of theme
      const hexColors = {
          primary: '#2563EB', // blue-600
          foreground: '#111827', // gray-900
          mutedForeground: '#6B7280', // gray-500
          accent: '#7C3AED', // violet-600
      };
      
      let y = 40;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 40;
      const maxWidth = doc.internal.pageSize.width - margin * 2;

      const addPageIfNeeded = (yPos: number) => {
        if (yPos > pageHeight - margin) {
          doc.addPage();
          return margin;
        }
        return yPos;
      };

      doc.setFontSize(22);
      doc.setFont('Inter', 'bold');
      doc.setTextColor(hexColors.primary);
      doc.text("Your Personalized Learning Roadmap", margin, y);
      y += 40;
      
      doc.setFont('Inter', 'normal');

      roadmap.skillsRoadmap.forEach((skill, index) => {
        y = addPageIfNeeded(y);
        
        doc.setFontSize(16);
        doc.setFont('Inter', 'bold');
        doc.setTextColor(hexColors.foreground);
        const skillTitle = `${index + 1}. ${skill.skillName}`;
        doc.text(skillTitle, margin, y);
        y += 20;

        doc.setFontSize(10);
        doc.setTextColor(hexColors.mutedForeground);
        const descriptionLines = doc.splitTextToSize(skill.skillDescription, maxWidth);
        doc.text(descriptionLines, margin, y);
        y += (descriptionLines.length * 12) + 20;
        
        y = addPageIfNeeded(y);
        
        // Required Skills
        doc.setFontSize(12);
        doc.setFont('Inter', 'bold');
        doc.setTextColor(hexColors.accent);
        doc.text("Required Skills", margin, y);
        y += 20;
        doc.setFontSize(10);
        doc.setTextColor(hexColors.foreground);
        if (skill.requiredSkills.length > 0) {
            skill.requiredSkills.forEach(reqSkill => {
                y = addPageIfNeeded(y);
                doc.text(`- ${reqSkill}`, margin + 10, y);
                y+=15;
            });
        } else {
             doc.text("None", margin + 10, y);
             y+=15;
        }
        y += 10;
        y = addPageIfNeeded(y);

        // Important Libraries
        doc.setFontSize(12);
        doc.setFont('Inter', 'bold');
        doc.setTextColor(hexColors.accent);
        doc.text("Important Libraries & Tools", margin, y);
        y += 20;
        doc.setFontSize(10);
        doc.setTextColor(hexColors.foreground);
        if (skill.importantLibraries.length > 0) {
            skill.importantLibraries.forEach(lib => {
                y = addPageIfNeeded(y);
                doc.text(`- ${lib}`, margin + 10, y);
                y+=15;
            });
        } else {
            doc.text("None recommended for beginners", margin + 10, y);
            y+=15;
        }
        y += 10;
        y = addPageIfNeeded(y);


        // Learning Plan
        doc.setFontSize(12);
        doc.setFont('Inter', 'bold');
        doc.setTextColor(hexColors.accent);
        doc.text("Step-by-Step Learning Plan", margin, y);
        y += 20;

        doc.setFontSize(10);
        doc.setTextColor(hexColors.foreground);
        skill.learningSteps.forEach(step => {
          y = addPageIfNeeded(y);
          const stepLines = doc.splitTextToSize(`- ${step}`, maxWidth - 10);
          doc.text(stepLines, margin + 10, y);
          y += (stepLines.length * 12) + 5;
        });
        
        y += 10;
        y = addPageIfNeeded(y);

        // Learning Resources
        doc.setFontSize(12);
        doc.setFont('Inter', 'bold');
        doc.setTextColor(hexColors.accent);
        doc.text("Learning Resources", margin, y);
        y += 20;

        doc.setFontSize(10);
        const resources = parseResources(skill.learningResources);
        resources.forEach(resource => {
          y = addPageIfNeeded(y);
          doc.setTextColor(hexColors.primary);
          doc.textWithLink(resource, margin + 10, y, { url: resource });
          y += 15;
        });

        y += 20; // Space between roadmap steps
      });

      doc.save('skill-roadmap.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {roadmap.futureScope && <FutureScopeAnalysis futureScope={roadmap.futureScope} />}
      <Card className="w-full bg-card/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <GraduationCap className="h-7 w-7 text-primary" />
            Your Personalized Learning Roadmap
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? (
                  <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Downloading...
                  </>
              ) : (
                  <>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                  </>
              )}
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
    </>
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
