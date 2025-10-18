import { RoadmapGenerator } from '@/components/roadmap-generator';
import { Map } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <header className="flex flex-col items-center text-center mb-8 md:mb-12">
          <div className="bg-primary/10 p-4 rounded-full mb-4 border border-primary/20">
            <Map className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            SkillMapper
          </h1>
          <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl">
            Input your skills and goals, and let AI chart your learning journey. Discover the next essential skills to achieve your career ambitions.
          </p>
        </header>
        <RoadmapGenerator />
      </div>
    </main>
  );
}
