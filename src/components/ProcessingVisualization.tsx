import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete';
}

export function ProcessingVisualization() {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: '1', label: 'Reading documents', status: 'active' },
    { id: '2', label: 'Preprocessing text', status: 'pending' },
    { id: '3', label: 'Running algorithm', status: 'pending' },
    { id: '4', label: 'Analyzing matches', status: 'pending' },
    { id: '5', label: 'Calculating results', status: 'pending' },
  ]);

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    
    steps.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setSteps(prev => 
          prev.map((step, i) => {
            if (i < index) return { ...step, status: 'complete' };
            if (i === index) return { ...step, status: 'active' };
            return step;
          })
        );
      }, index * 600);
      intervals.push(timeout);
    });

    return () => intervals.forEach(clearTimeout);
  }, []);

  return (
    <Card className="p-8 animate-fade-in">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
            <Loader2 className="w-4 h-4 text-accent animate-spin" />
            <span className="text-sm font-medium text-accent">Processing Analysis</span>
          </div>
          <p className="text-muted-foreground">Please wait while we analyze your documents...</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-4">
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                step.status === 'complete' && "bg-success/20",
                step.status === 'active' && "bg-accent/20",
                step.status === 'pending' && "bg-muted"
              )}>
                {step.status === 'complete' && (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                )}
                {step.status === 'active' && (
                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                )}
                {step.status === 'pending' && (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    step.status === 'complete' && "text-success",
                    step.status === 'active' && "text-accent",
                    step.status === 'pending' && "text-muted-foreground"
                  )}>
                    {step.label}
                  </span>
                  {step.status === 'active' && (
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className={cn(
                    "ml-5 mt-2 w-0.5 h-6 transition-colors duration-300",
                    step.status === 'complete' ? "bg-success" : "bg-border"
                  )} />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 flex justify-center">
          <div className="relative w-64 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
              style={{ 
                width: `${(steps.filter(s => s.status === 'complete').length / steps.length) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
