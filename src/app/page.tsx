import { RoadmapGenerator } from '@/components/roadmap-generator';
import { Map } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <header className="flex flex-col items-center text-center mb-10 md:mb-16">
          <div className="bg-primary/10 p-4 rounded-full mb-4 border-2 border-primary/20 shadow-lg">
            <Map className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Welcome to SkillMapper
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
            Chart your learning journey with AI. Input your current skills and career goals to get a personalized roadmap to success.
          </p>
        </header>
        <RoadmapGenerator />
      </div>
    </main>
  );
}
