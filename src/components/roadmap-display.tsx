
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, GraduationCap, BookOpen, CheckCircle2, ChevronRight, Goal, Download, Loader, Lightbulb } from 'lucide-react';
import type { GenerateSkillsRoadmapOutput } from '@/ai/flows/generate-skills-roadmap';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleToggle = (index: number) => {
    setOpenStep(openStep === index ? null : index);
  };
  
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });
      doc.setFont('Inter', 'normal');

      // --- Use browser colors ---
      const rootStyles = getComputedStyle(document.documentElement);
      const colors = {
          primary: rootStyles.getPropertyValue('--primary').trim(),
          foreground: rootStyles.getPropertyValue('--foreground').trim(),
          mutedForeground: rootStyles.getPropertyValue('--muted-foreground').trim(),
          accent: rootStyles.getPropertyValue('--accent').trim(),
      };
      
      const toHex = (hsl: string) => {
          const [h, s, l] = hsl.split(' ').map(parseFloat);
          const s_norm = s / 100;
          const l_norm = l / 100;
          const c = (1 - Math.abs(2 * l_norm - 1)) * s_norm;
          const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
          const m = l_norm - c / 2;
          let r = 0, g = 0, b = 0;
          if (0 <= h && h < 60) { [r, g, b] = [c, x, 0]; }
          else if (60 <= h && h < 120) { [r, g, b] = [x, c, 0]; }
          else if (120 <= h && h < 180) { [r, g, b] = [0, c, x]; }
          else if (180 <= h && h < 240) { [r, g, b] = [0, x, c]; }
          else if (240 <= h && h < 300) { [r, g, b] = [x, 0, c]; }
          else if (300 <= h && h < 360) { [r, g, b] = [c, 0, x]; }
          r = Math.round((r + m) * 255);
          g = Math.round((g + m) * 255);
          b = Math.round((b + m) * 255);
          return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      };
      const hexColors = {
          primary: toHex(colors.primary),
          foreground: toHex(colors.foreground),
          mutedForeground: toHex(colors.mutedForeground),
          accent: toHex(colors.accent),
      };
      // --- End color conversion ---
      
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
        y += (descriptionLines.length * 12) + 10;
        
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
